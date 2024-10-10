import path from 'path';
import { app } from 'electron';
import { getAssetPath } from './util';
import { appDataSource } from './database';
import { registerBridge } from './bridge';
import { createIndexWindow } from './window';
import MenuBuilder from './menu';

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
    createIndexWindow();
    const menuBuilder = new MenuBuilder();
    menuBuilder.buildMenu();
    app.on('activate', () => {
      createIndexWindow();
    });
  })
  .catch((error) => {
    console.error(error);
  });
