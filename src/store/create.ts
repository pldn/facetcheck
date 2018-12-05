//external dependencies
import { createStore as _createStore, applyMiddleware, compose, Middleware, Store } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "../reducers";
import createPromiseMw from "./promiseMw";

//import own dependencies
import { GlobalState, default as reducer } from "../reducers";
// import * as History from 'history'
import ApiClient from "../helpers/ApiClient";
import thunk from "redux-thunk";
declare var module: any;
declare var window: __App.ReactWindow;

export default function createStore(apiClient: ApiClient) {
  // Sync dispatched route actions to the history
  const epicMw = createEpicMiddleware();
  const middleware: Middleware[] = [
    createPromiseMw(apiClient),
    epicMw,
    thunk
  ];
  //we're on the client, so we can create the connection
  let finalCreateStore: (...args: any[]) => Store<GlobalState>;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    //only include lib here, when we're not running prod mode
    const { persistState } = require("redux-devtools");
    const storeMw: any[] = [applyMiddleware(...middleware)];
    if (window.__REDUX_DEVTOOLS_EXTENSION__) storeMw.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    storeMw.push(persistState(<any>window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
    finalCreateStore = (<any>compose)(...storeMw)(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store: Store<GlobalState> = finalCreateStore(reducer);

  epicMw.run(rootEpic);

  //It's bad practice to use the redux '@@INIT' action to check whether redux state
  //was instantiated. So, therefore we're using out own action for this
  store.dispatch({ type: "INSTANTIATED" });
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept("../reducers", () => {
      store.replaceReducer(<any>reducer);
    });
  }
  return store;
}
