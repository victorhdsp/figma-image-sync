import { DRIVE_REDIRECT } from "../utils/url";

const USER_NOT_FOUND = 'User not found';

export function create_connection(userId: string | null) {
    if (!userId) {
        figma.notify(USER_NOT_FOUND);
        throw new Error(USER_NOT_FOUND);
    }
    figma.openExternal(`${DRIVE_REDIRECT}&state=${userId}`);
    figma.closePlugin();
}

export const CREATE_CONNECTION = 'create_connection';