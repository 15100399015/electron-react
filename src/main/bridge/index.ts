import { ipcMain } from 'electron';
import { handleRequest } from './request';

const map = {
  request: handleRequest,
};

export async function register() {
  Object.entries(map).forEach(([key, value]) => {
    ipcMain.handle(key, value);
  });
}
