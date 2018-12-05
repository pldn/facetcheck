//external dependencies
import * as reactRedux from "react-redux";
import * as ReduxObservable from "redux-observable";
//import own dependencies

// import {State as NotificationState} from './notifications';
import { ResponseMetaData } from "../helpers/ApiClient";
import * as Redux from "redux";
import * as _ from "lodash";

import ApiClient from "../helpers/ApiClient";

/**
 * Reducers (keep in alphabetic order)
 */
// import * as accounts from './accounts';
import * as app from "./app";
import * as facets from "./facets";
import * as statements from "./statements";
import * as notifications from "./notifications";


import { GlobalState } from "./";
export type GlobalStateAsJs = { [K in keyof GlobalState]: any };

/**
Keep in alphabetic order
**/
export interface GlobalState extends Partial<reactRedux.ProviderProps> {
  app: app.StateRecordInterface;
  facets: facets.FacetState;
  notifications: notifications.StateInterface;
  statements: statements.StateRecordInterface;
}
const appReducer = Redux.combineReducers(
  <{ [K in keyof GlobalState]: any }>{
    /**
   * Keep in alphabetic order
   */
    app: app.reducer,
    facets: facets.reducer,
    notifications: notifications.reducer,
    statements: statements.reducer,
  }
);
export var rootEpic = ReduxObservable
  .combineEpics
  (
    ...facets.epics,
    ...statements.epics

  );

//define some action properties that are exposed via our mw
export interface _GlobalActions<A = any> {
  types?: [A, A, A];
  type?: A;
  result?: any;
  meta?: ResponseMetaData;
  error?: string;
  message?: string;
  status?: number;
  promise?: (apiClient?: ApiClient) => Promise<any>;
}
//Need to merge it with a promise, as our promise MW might make it into one
//some of our async dispatched actions expect a thenable result
export type GlobalActions<A = any> = Partial<_GlobalActions<A>> & Partial<Promise<any>>;
export interface Thunk<A> {
  (dispatch: (action: A) => any, getState: () => GlobalState): any;
}

export default appReducer;
