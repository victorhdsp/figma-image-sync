export const API_REDIRECT = 'http://localhost:8787/v1/google-oauth/redirect';
export const API_CONSUME = 'http://localhost:8787/v1/google-oauth';
export const API_DELETE = 'http://localhost:8787/v1/google-oauth';
 
export const DRIVE_ABOUT = 'https://www.googleapis.com/drive/v3/about?fields=user';
export const DRIVE_REDIRECT = `https://accounts.google.com/o/oauth2/v2/auth?client_id=651163931045-7adjaba9d4ioo39195kq1v63okenfa0o.apps.googleusercontent.com&redirect_uri=${API_REDIRECT}&response_type=token&scope=https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.file&include_granted_scopes=true`;
export const DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files';