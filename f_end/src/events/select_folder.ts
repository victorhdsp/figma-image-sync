export function select_folder(folderId: string) {
    const pluginId = figma.root.getPluginData('plugin_id');
    figma.clientStorage.setAsync(`${pluginId}_folder`, folderId);
    figma.showUI(__uiFiles__.selected);
}

export const SELECT_FOLDER = 'select_folder';