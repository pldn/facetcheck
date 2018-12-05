declare namespace __App {
  export interface ReactWindow extends Window {
    __data: any;
    React: any;
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

declare var __DEVELOPMENT__: boolean;
declare var __CLIENT__: boolean;
declare var __SERVER__: boolean;
declare var __DEVTOOLS__: boolean;


declare namespace NodeJS {
  interface Global {
  }
}
