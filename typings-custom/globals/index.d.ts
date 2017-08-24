declare namespace __App {
  export interface ReactWindow extends Window {
    __data: any;
    React: any;
    devToolsExtension: any;
  }
}

declare var __DEVELOPMENT__: boolean;
declare var __CLIENT__: boolean;
declare var __SERVER__: boolean;
declare var __DEVTOOLS__: boolean;
declare var __DISABLE_SSR__: boolean;

declare var webpackIsomorphicTools: boolean; //todo;fix

declare namespace NodeJS {
  interface Global {
    socket: SocketIOClient.Socket;
  }
}
