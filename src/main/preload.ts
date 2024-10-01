import { contextBridge, ipcRenderer } from 'electron';

export interface Bridge {
  request: <T, E>(path: string, body: T) => Promise<E>;
}

const bridgeConfig: Bridge = {
  request: async (path, body) => {
    return ipcRenderer.invoke('request', path, body);
  },
};

contextBridge.exposeInMainWorld('bridge', bridgeConfig);
