import { create_connection, CREATE_CONNECTION } from './events/create_connection';
import { get_drive, GET_DRIVE } from './events/get_drive';
import { HAS_CONNECTED, has_connected } from './events/has_connected';
import { SELECT_FOLDER, select_folder } from './events/select_folder';
import { UNSELECT_FOLDER, unselect_folder } from './events/unselect_folder';
import { STARTED, started } from './events/started';

(() => {
  figma.showUI(__uiFiles__.main);
  
  const user = figma.currentUser;
  
  if (!user || !user.id) {
    figma.closePlugin('User not found');
    return;
  }

  figma.ui.onmessage =  (msg: {type: string, count: number, id: string}) => {
    if (msg.type === HAS_CONNECTED)
      has_connected(user, msg.id);

    if (msg.type === CREATE_CONNECTION)
      create_connection(user.id);
    
    if (msg.type === GET_DRIVE)
      get_drive();

    if (msg.type === SELECT_FOLDER)
      select_folder(msg.id);

    if (msg.type === UNSELECT_FOLDER)
      unselect_folder();

    if (msg.type === STARTED)
      started();
  };
})();
