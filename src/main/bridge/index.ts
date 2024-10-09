import { ipcMain } from 'electron';
import { requestBridgeHandler } from './request';
import { fileBridgeHandler } from './file';
import { windowBridgeHandler } from './window';
import { databaseBridgeHander } from './database';

const map: Record<string, Function> = {
  request: requestBridgeHandler,
  file: fileBridgeHandler,
  database: databaseBridgeHander,
  window: windowBridgeHandler,
};

export async function registerBridge() {
  Object.entries(map).forEach(([key, value]) => {
    ipcMain.handle(key, (event, ...args) => value(...args));
  });
}
