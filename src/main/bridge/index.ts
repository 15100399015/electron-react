import { ipcMain } from 'electron';
import { handleRequest } from './request';
import { handleFile } from './file';
import { handleDatabase } from './database';

const map = {
  request: handleRequest,
  file: handleFile,
  database: handleDatabase,
};

export async function register() {
  Object.entries(map).forEach(([key, value]) => {
    ipcMain.handle(key, value);
  });
}
