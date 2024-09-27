import { member } from './member';
import { event } from './event';

const routes = { ...member, ...event } as Record<string, Function>;

export async function handleRequest(event: any, path: string, body: any) {
  const controller = routes[path];
  if (controller && typeof controller === 'function') {
    return await routes[path](body);
  }
  throw new Error('404');
}
