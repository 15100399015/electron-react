import path from 'path';
import { app, BrowserWindow, shell, screen, BaseWindow } from 'electron';
import MenuBuilder from './menu';
import { getAssetPath } from './util';

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

export const mainWindow = new WindowManager();

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
      contextIsolation: true,
      nodeIntegration: false,
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
  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();
  window.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  window.loadURL(url);
  return window;
}
