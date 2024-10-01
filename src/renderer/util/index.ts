export async function request<T, E>(path: string, body: T) {
  return window.bridge.request<T, E>(path, body);
}
