import { app, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

function parseDataUrl(dataUrl: string) {
  const parts = dataUrl.split(',');
  let meta = parts[0];
  let data = parts[1];
  let mediaType = 'text/plain';
  let isBase64 = false;
  if (meta.includes(';')) {
    const metaParts = meta.split(';');
    mediaType = metaParts[0].replace('data:', '');
    if (metaParts.includes('base64')) {
      isBase64 = true;
    }
  }
  return {
    mediaType,
    isBase64,
    data,
  };
}

const routes: Record<string, Function> = {
  save: async (body: any) => {
    const { fileName, fileData } = body;
    const { data, isBase64 } = parseDataUrl(fileData);
    if (!isBase64) Promise.reject('必须是 base64');
    return await dialog
      .showSaveDialog({
        title: '保存文件',
        defaultPath: path.join(app.getPath('desktop'), fileName),
      })
      .then((res) => {
        if (!res.canceled && res.filePath) {
          const buffer = Buffer.from(data, 'base64');
          fs.writeFileSync(res.filePath, buffer);
        } else {
          return Promise.reject('用户取消');
        }
      });
  },

  exportAllData: async () => {},
};

export async function handleFile(event: any, apiName: string, body: any) {
  const controller = routes[apiName];
  if (controller && typeof controller === 'function') {
    return await routes[apiName](body);
  }
  throw new Error('404');
}
