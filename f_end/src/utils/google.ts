import { DRIVE_ABOUT, DRIVE_FILES } from "./url";

export interface IAbout {
    user: {
        kind: string,
        displayName: string,
        photoLink: string,
        me: boolean,
        permissionId: string,
        emailAddress: string
    }
}

export async function about(token: string): Promise<IAbout | false> {
    const response = await fetch(DRIVE_ABOUT, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok)
        return response.json() as Promise<IAbout>;
    return false;
}

export interface IFile {
    kind: string;
    mimeType: string;
    id: string;
    name: string;
}

export interface IFiles {
    kind: string;
    incompleteSearch: boolean;
    files: IFile[];
}

export async function list_images_and_folders(token: string, folderId: string): Promise<IFile[] | false> {
    const qSearch = `'${folderId}' in parents AND (mimeType contains 'image/' OR mimeType = 'application/vnd.google-apps.folder')`;
    const url = `${DRIVE_FILES}?q=${qSearch}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
        const data = await response.json() as IFiles;
        return data.files;
    }
    return false;
}

export interface IImageInfo {
    modifiedTime: string;
    name: string;
    id: string;
}

export async function get_image_info(token: string, fileId: string): Promise<IImageInfo | false> {
    const url = `${DRIVE_FILES}/${fileId}?fields=modifiedTime,name,id`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok)
        return response.json() as Promise<IImageInfo>;
    return false;
}

export async function download_image(token: string, fileId: string): Promise<Uint8Array | false> {
    const url = `${DRIVE_FILES}/${fileId}?alt=media&source=downloadUrl`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
        const data = await response.arrayBuffer();
        return new Uint8Array(data);
    }
    return false;
}

export default {
    about,
    list_images_and_folders,
    get_image_info,
    download_image
}