import { createDetailWindow } from '../../window';

const routes = {
  toDetail: async (body: { id: number }) => {
    createDetailWindow(body.id);
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
