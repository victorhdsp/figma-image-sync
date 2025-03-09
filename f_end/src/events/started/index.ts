import api from "../../utils/api";
import google, { IFile, IImageInfo } from "../../utils/google";
import { createComponent, getComponent, componentNeedUpdate, setImageInComponent, setSvgInComponent } from "./component";
import { create_or_set_page } from "./page";

export async function create_or_set_component(page: PageNode, imageInfo: IImageInfo) {
  let fComp: ComponentNode | null;
  fComp = await getComponent(page, imageInfo);
  if (fComp) {
    if (!await componentNeedUpdate(fComp, imageInfo))
      return null;
  } else
    fComp = await createComponent(page, imageInfo);
  
  if (!fComp) {
    figma.notify("Strange error in component");
    return null;
  }
  return fComp;
}

async function addImageInPage(file: IFile, page: PageNode, token: string) {
  let fComp: ComponentNode | null;
  const imageInfo = await google.get_image_info(token, file.id);
  if (!imageInfo) {
    figma.notify("Error to get image info");
    return false;
  }
  
  if (file.mimeType.includes("x-photoshop")) {
    figma.notify("Not implemented yet");
    return false;
  }

  fComp = await create_or_set_component(page, imageInfo);
  if (!fComp)
    return false;

  if (file.mimeType.includes("svg")) {
    const svg = await google.download_svg(token, file.id);
    if (!svg) {
      figma.notify("Error to download svg");
      return false;
    }
    await setSvgInComponent(fComp, svg);
  } 
  else {
    const base64 = await google.download_image(token, file.id);
    if (!base64) {
      figma.notify("Error to download image");
      return false;
    }
    await setImageInComponent(fComp, base64);
  }
  page.appendChild(fComp);
  return true;
}

async function exec(folderId: string, page: PageNode, token: string) {
  const files = await google.list_images_and_folders(token, folderId);
  
  if (!files) {
    figma.notify("No files found");
    return;
  }

  while (files.length > 0) {
    const file = files.pop();
    if (file)
      if (file?.mimeType === "application/vnd.google-apps.folder") {
        const folderFiles = await google.list_images_and_folders(token, file.id);
        if (folderFiles)
          files.push(...folderFiles);
      } else {
        await addImageInPage(file, page, token);
      }
  }
}

export async function started() {
  const pluginId = figma.root.getPluginData("plugin_id");
  const folderId = await figma.clientStorage.getAsync(`${pluginId}_folder`);
  const token = await figma.clientStorage.getAsync('token');
  const page = await create_or_set_page(folderId);
  await exec(folderId, page, token);
  setTimeout(() => started(), 10 * 1000);
}

export const STARTED = "started";