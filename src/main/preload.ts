import { contextBridge, ipcRenderer } from 'electron';

export interface Bridge {
  request: <T, E>(path: string, body: T) => Promise<E>;
  file: <T, E>(apiName: string, body: T) => Promise<E>;
  database: <T, E>(apiName: string, body: T) => Promise<E>;
}

const bridgeConfig: Bridge = {
  request: async (path, body) => {
    return ipcRenderer.invoke('request', path, body);
  },
  file: async (apiName, body) => {
    return ipcRenderer.invoke('file', apiName, body);
  },
  database: async (apiName, body) => {
    return ipcRenderer.invoke('database', apiName, body);
  },
};

contextBridge.exposeInMainWorld('bridge', bridgeConfig);
