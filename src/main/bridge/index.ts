import { ipcMain } from 'electron';
import { handleRequest } from './request';

const map = {
  request: handleRequest,
};

export function register() {
  Object.entries(map).forEach(([key, value]) => {
    ipcMain.handle(key, value);
  });
}
