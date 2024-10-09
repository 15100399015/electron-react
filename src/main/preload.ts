import { contextBridge, ipcRenderer } from 'electron';

import type { DatabaseBridgeHanderType } from './bridge/database';
import type { FileBridgeHandlerType } from './bridge/file';
import type { RequestBridgeHandlerType } from './bridge/request';
import type { WindowBridgeHandlerType } from './bridge/window';

export interface Bridge {
  request: RequestBridgeHandlerType;
  file: FileBridgeHandlerType;
  database: DatabaseBridgeHanderType;
  window: WindowBridgeHandlerType;
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
  // @ts-ignore
  window: async (apiName, ...args) => {
    return ipcRenderer.invoke('window', apiName, ...args);
  },
};

contextBridge.exposeInMainWorld('bridge', bridgeConfig);
