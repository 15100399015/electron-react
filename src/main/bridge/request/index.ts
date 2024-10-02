import { member } from './member';
import { event } from './event';

const routes = { ...member, ...event };

type RoutesType = typeof routes;
type ApiNames = keyof RoutesType;

export interface RequestBridgeHandlerType {
  <K extends ApiNames>(
    apiName: K,
    ...args: Parameters<RoutesType[K]>
  ): ReturnType<RoutesType[K]>;
}

export const requestBridgeHandler = async (
  path: ApiNames,
  ...args: Parameters<RoutesType[ApiNames]>
) => {
  const controller = routes[path];
  if (controller && typeof controller === 'function') {
    // @ts-ignore
    return await controller(...args);
  }
  throw new Error('404');
};
