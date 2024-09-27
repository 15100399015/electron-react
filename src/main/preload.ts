import { contextBridge, ipcRenderer } from 'electron';

export interface Bridge {
  request: <T>(path: string, body: any) => Promise<T>;
}

const bridgeConfig: Bridge = {
  request: async (path, body) => {
    return ipcRenderer.invoke('request', path, body);
  },
};

contextBridge.exposeInMainWorld('bridge', bridgeConfig);
