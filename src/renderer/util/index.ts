export async function request<T>(path: string, body: any) {
  return window.bridge.request<T>(path, body);
}
