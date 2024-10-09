import path from 'path';
import { app } from 'electron';
import { getAssetPath, resolveHtmlPath } from './util';
import { appDataSource } from './database';
import { registerBridge } from './bridge';
import { createBrowserWindow, mainWindow } from './window';

// 开发环境 source map 支持
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// 是否开启 debug
const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

// 创建窗口
const createMainWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const window = createBrowserWindow(resolveHtmlPath('index.html'), {
    maximize: true,
  });
  // 创建窗口
  mainWindow.set(window);
  window.on('closed', () => {
    mainWindow.clear();
  });
};

/**
 * window 中所有关口关闭则退出程序
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const dbPath = path.join(getAssetPath('database/data.sqlite'));

appDataSource.setOptions({
  database: dbPath,
});

Promise.all([app.whenReady(), appDataSource.initialize(), registerBridge()])
  .then(() => {
    createMainWindow();
    app.on('activate', () => {
      if (!mainWindow.get()) createMainWindow();
    });
  })
  .catch((error) => {
    console.error(error);
  });
