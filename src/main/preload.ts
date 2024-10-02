import { contextBridge, ipcRenderer } from 'electron';

import type { DatabaseBridgeHanderType } from './bridge/database';
import type { FileBridgeHandlerType } from './bridge/file';
import type { RequestBridgeHandlerType } from './bridge/request';

export interface Bridge {
  request: RequestBridgeHandlerType;
  file: FileBridgeHandlerType;
  database: DatabaseBridgeHanderType;
}

const bridgeConfig: Bridge = {
  // @ts-ignore
  request: async (path, ...args) => {
    return ipcRenderer.invoke('request', path, ...args);
  },
  // @ts-ignore
  file: async (apiName, ...args) => {
    return ipcRenderer.invoke('file', apiName, ...args);
  },
  // @ts-ignore
  database: async (apiName, ...args) => {
    return ipcRenderer.invoke('database', apiName, ...args);
  },
}

contextBridge.exposeInMainWorld('bridge', bridgeConfig);
