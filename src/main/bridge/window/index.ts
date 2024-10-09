import { resolveHtmlPath } from '../../util';
import { createBrowserWindow, detailWindow, mainWindow } from '../../window';

const routes = {
  toDetail: async (body: { id: number }) => {
    const current = detailWindow.get();
    if (current) {
      current.loadURL(resolveHtmlPath(`index.html#/detail/${body.id}`));
    } else {
      const window = createBrowserWindow(
        resolveHtmlPath(`index.html#/detail/${body.id}`),
        { parent: mainWindow.get() },
      );
      detailWindow.set(window);
      window.on('closed', () => {
        detailWindow.clear();
      });
    }
  },
};

type RoutesType = typeof routes;
type ApiNames = keyof RoutesType;

export interface WindowBridgeHandlerType {
  <K extends ApiNames>(
    apiName: K,
    ...args: Parameters<RoutesType[K]>
  ): ReturnType<RoutesType[K]>;
}

export const windowBridgeHandler = async (
  apiName: ApiNames,
  ...args: Parameters<RoutesType[ApiNames]>
) => {
  const controller = routes[apiName];
  if (controller && typeof controller === 'function') {
    return await controller(...args);
  }
  throw new Error('404');
};
