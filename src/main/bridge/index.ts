import { ipcMain } from 'electron';
import { requestBridgeHandler } from './request';
import { fileBridgeHandler } from './file';
import { databaseBridgeHander } from './database';

const map: Record<string, Function> = {
  request: requestBridgeHandler,
  file: fileBridgeHandler,
  database: databaseBridgeHander,
};

export async function registerBridge() {
  Object.entries(map).forEach(([key, value]) => {
    ipcMain.handle(key, (event, ...args) => value(...args));
  });
}
