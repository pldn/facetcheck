
declare module "redux-connect" {
  import * as React from 'react';
  // import * as ReactRedux from 'react-redux';
  import * as Redux from 'redux';
  interface PromiseArg<G> {
    store: Redux.Store<G>;
    params:any
  }
  export interface IAsyncConnect<G> {
    promise?: (params:PromiseArg<G>) => Promise<any>;
    // promiseFunc?: (arg:any) => Promise<any> ,
    // type?: any,
    types?: [any, any, any]//request, success, fail
  }



  export class ReduxAsyncConnect extends React.Component<any, any> { }

  export function asyncConnect<G>(mapStateToProps: IAsyncConnect<G>[]): ClassDecorator;


  // export interface ReduxAsyncConnect extends React.Component<any,any>{}
}
