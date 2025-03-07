import api from "../utils/api";
import google, { IAbout } from "../utils/google";

async function check_connection(user: User) {
  let token: string | false;
  let googleAPI: IAbout | false;

  
  if (!user || !user.id) {
    console.error('User not found');
    figma.notify('User not found');
    return false;
  }
  token = await figma.clientStorage.getAsync('token');
  
  if (token) {
    let googleAPI = await google.about(token);
    if (googleAPI)
      return true;
  }
  
  token = await api.get_token(user.id);
  console.log('Checking connection');
  if (!token) {
    console.error('Token not found from API');
    figma.notify('Token not found from API');
    return false;
  }

  googleAPI = await google.about(token);
  
  if (!googleAPI) {
    await api.delete_token(user.id);
    await figma.clientStorage.deleteAsync('token');
    console.error('Google API not authorized');
    figma.notify('Google API not authorized');
    return false;
  }

  await figma.clientStorage.setAsync('token', token);
  return true;
}

export function has_connected(user: User, pluginId: string) {
    if (!figma.root.getPluginData('plugin_id'))
        figma.root.setPluginData('plugin_id', pluginId);
    check_connection(user).then((connected) => {
        if (connected) {
            const pluginId = figma.root.getPluginData('plugin_id');
            figma.clientStorage.getAsync(`${pluginId}_folder`)
              .then((hasSelectedFolder) => {
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

export const HAS_CONNECTED = 'has_connected';