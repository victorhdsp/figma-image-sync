export function unselect_folder() {
    const pluginId = figma.root.getPluginData('plugin_id');
    figma.clientStorage.setAsync(`${pluginId}_folder`, '');
    figma.showUI(__uiFiles__.connected);
}

export const UNSELECT_FOLDER = 'unselect_folder';