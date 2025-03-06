const API_REDIRECT = 'http://localhost:8787/v1/google-oauth/redirect';
const API_CONSUME = 'http://localhost:8787/v1/google-oauth';
const API_DELETE = 'http://localhost:8787/v1/google-oauth';

const DRIVE_ABOUT = 'https://www.googleapis.com/drive/v3/about?fields=user';
const DRIVE_REDIRECT = `https://accounts.google.com/o/oauth2/v2/auth?client_id=651163931045-7adjaba9d4ioo39195kq1v63okenfa0o.apps.googleusercontent.com&redirect_uri=${API_REDIRECT}&response_type=token&scope=https://www.googleapis.com/auth/drive.readonly&include_granted_scopes=true`;
const DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files';

type File = { kind: string, mimeType: string, id: string, name: string };

let token: string | undefined;

async function has_connected(user: User) {

  token = await figma.clientStorage.getAsync('token');
  let googleAPI = await fetch(DRIVE_ABOUT, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (googleAPI.ok)
    return true;

  token = (await (await fetch(`${API_CONSUME}?id=${user.id}`)).json()).token;

  googleAPI = await fetch(DRIVE_ABOUT, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (googleAPI.ok) {
    await figma.clientStorage.setAsync('token', token);
    return true;
  } else {
    await fetch(`${API_DELETE}?id=${user?.id}`, {
      method: 'DELETE'
    })
    await figma.clientStorage.deleteAsync('token');
    token = undefined;
    return false;
  }
}

async function create_or_set_page(pluginId: string) {
  const pages = figma.root.children;
  let page = pages.find((page) => page.name === pluginId);
  if (!page) {
    page = figma.createPage();
    page.name = pluginId;
  }
  return page;
}

async function get_images_urls(images: File[]) {
  const urls: string[] = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const urlDownload = `${DRIVE_FILES}/${image.id}/download`;
    const urlData = await (await fetch(urlDownload, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })).json();
    urls.push(urlData.response.downloadUri);
  }
  return urls;
}

async function create_images_in_page(page: PageNode, images: string[]) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const download = await fetch(image, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const fComp = figma.createComponent();
    const base64 = new Uint8Array(await download.arrayBuffer());
    const fImg = figma.createImage(base64);
    fComp.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: fImg.hash }];
    fComp.x = x;
    fComp.y = y;
    const { width, height } = await fImg.getSizeAsync();
    fComp.resize(width, height);
    x += width + 100;
    page.appendChild(fComp);
  }
}

async function get_images_recursive(folderId: string) {
  const url = `${DRIVE_FILES}?q='${folderId}' in parents AND (mimeType contains 'image/' OR mimeType = 'application/vnd.google-apps.folder')`;
  const files = (await (await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })).json()).files as File[];
  return files;
}

async function started(folderId: string) {
  const images: File[] = [];
  const files = await get_images_recursive(folderId);
  while (files.length > 0) {
    const file = files.pop();
    if (file)
      if (file?.mimeType === 'application/vnd.google-apps.folder') {
        const folderFiles = await get_images_recursive(file.id);
        files.push(...folderFiles);
      } else {
        images.push(file);
      }
  }
  const page = await create_or_set_page(folderId);
  const imageUrls = await get_images_urls(images);
  await create_images_in_page(page, imageUrls);
}

(() => {
  figma.showUI(__uiFiles__.main);
  
  const user = figma.currentUser;
  
  if (!user) {
    figma.closePlugin('User not found');
    return;
  }

  figma.ui.onmessage =  (msg: {type: string, count: number, id: string}) => {
    if (msg.type === 'has_connected') {
      if (!figma.root.getPluginData('plugin_id'))
        figma.root.setPluginData('plugin_id', msg.id);
      has_connected(user).then((connected) => {
        if (connected) {
          const pluginId = figma.root.getPluginData('plugin_id');
          figma.clientStorage.getAsync(`${pluginId}_folder`).then((hasSelectedFolder) => {
            if (hasSelectedFolder && hasSelectedFolder !== '') {
              figma.showUI(__uiFiles__.selected);
            } else {
              figma.showUI(__uiFiles__.connected);
            }
          });
        } else {
          figma.showUI(__uiFiles__.disconnected);
        }
      });
    }

    if (msg.type === 'create_connection') {
      figma.openExternal(`${DRIVE_REDIRECT}&state=${user.id}`);
      figma.closePlugin();
    }
    
    if (msg.type === 'get_drive') {
      figma.ui.postMessage({ type: 'update_drive', token });
    }

    if (msg.type === 'select_folder') {
      const pluginId = figma.root.getPluginData('plugin_id');
      figma.clientStorage.setAsync(`${pluginId}_folder`, msg.id);
      figma.showUI(__uiFiles__.selected);
    }

    if (msg.type === 'unselect_folder') {
      const pluginId = figma.root.getPluginData('plugin_id');
      figma.clientStorage.setAsync(`${pluginId}_folder`, '');
      figma.showUI(__uiFiles__.connected);
    }

    if (msg.type === 'started') {
      const pluginId = figma.root.getPluginData('plugin_id');
      figma.clientStorage.getAsync(`${pluginId}_folder`).then((folderId) => {
        started(folderId);
      });
    }
  };
})();
