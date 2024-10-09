import path from 'path';
import { app } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  let url = '';
  if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:${process.env.PORT || 1212}/${htmlFileName}`;
  } else {
    url = `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  }
  return decodeURIComponent(url);
}

// assets 文件夹路径
export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
};
