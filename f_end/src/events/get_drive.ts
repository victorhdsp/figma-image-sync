export async function get_drive() {
    const token = await figma.clientStorage.getAsync('token');
    figma.ui.postMessage({ type: 'update_drive', token });
}

export const GET_DRIVE = 'get_drive';