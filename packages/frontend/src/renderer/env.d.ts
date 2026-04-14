/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'svgedit/dist/editor/Editor.js' {
  const Editor: any
  export default Editor
}

declare global {
  interface Window {
    ipcRenderer: {
      invoke(channel: string, ...args: any[]): Promise<any>;
      on(channel: string, listener: (event: any, ...args: any[]) => void): void;
      off(channel: string, ...omit: any[]): void;
      send(channel: string, ...omit: any[]): void;
    };
  }
}

export {}
