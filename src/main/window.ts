import path from 'path';
import { app, BrowserWindow, shell, screen, BaseWindow } from 'electron';
import { getAssetPath, resolveHtmlPath } from './util';

class WindowManager {
  _window?: BrowserWindow;
  get() {
    return this._window;
  }
  set(window: BrowserWindow) {
    this._window = window;
  }
  clear() {
    this._window = void 0;
  }
}

export const indexWindow = new WindowManager();

export const detailWindow = new WindowManager();

export function createBrowserWindow(
  url: string,
  option?: {
    maximize?: boolean;
    parent?: BaseWindow;
  },
) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const window = new BrowserWindow({
    show: false,
    icon: getAssetPath('icon.png'),
    minWidth: width / 2,
    minHeight: height / 2,
    width: Math.floor((width * 9) / 10),
    height: Math.floor((height * 9) / 10),
    parent: option?.parent,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  window.on('ready-to-show', () => {
    if (option?.maximize) {
      window.maximize();
      window.focus();
    } else {
      window.show();
    }
  });
  window.webContents.on('context-menu', (event) => {
    event.preventDefault();
  });

  window.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  window.loadURL(url);
  return window;
}

export const createIndexWindow = async () => {
  const current = indexWindow.get();
  if (current) {
    return current;
  }
  const window = createBrowserWindow(resolveHtmlPath('index.html'), {
    maximize: true,
  });
  indexWindow.set(window);
  window.on('closed', () => {
    indexWindow.clear();
  });
  return window;
};

export const createDetailWindow = async (id: number) => {
  const current = detailWindow.get();
  if (current) {
    current.loadURL(resolveHtmlPath(`detail.html#/${id}`));
    return current;
  }
  const window = createBrowserWindow(resolveHtmlPath(`detail.html#/${id}`), {
    parent: indexWindow.get(),
  });
  detailWindow.set(window);
  window.on('closed', () => {
    indexWindow.get()?.focus();
    detailWindow.clear();
  });
  return window;
};
