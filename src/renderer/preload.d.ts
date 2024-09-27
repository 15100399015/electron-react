import { Bridge } from '../main/preload';

declare global {
  interface Window {
    bridge: Bridge;
  }
}

export {};
