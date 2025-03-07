import { API_CONSUME } from "./url";

export async function get_token(userId: string): Promise<string | false> {
    const response = await fetch(`${API_CONSUME}?id=${userId}`);
    if (response.ok) {
        console.log('Token not found');
        const data = await response.json() as any;
        if (data && data.token)
            return data.token;
    }
    return false;
}

export async function delete_token(userId: string): Promise<boolean> {
    const response = await fetch(`${API_CONSUME}?id=${userId}`, {
        method: 'DELETE'
    });
    return response.ok;
}

export default {
    get_token,
    delete_token
}