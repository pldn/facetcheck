//external dependencies
import * as reactRedux from 'react-redux';
import * as reduxForm from 'redux-form';
import * as ReduxObservable from 'redux-observable';
//import own dependencies

// import {State as NotificationState} from './notifications';
import {ResponseMetaData} from 'helpers/ApiClient';
import * as Redux from 'redux';
const {  reducer  } = require('redux-connect');
import * as _ from 'lodash'
import {reducer as form} from 'redux-form';

import SocketClient from 'helpers/SocketClient'
import ApiClient from 'helpers/ApiClient'

/**
 * Reducers (keep in alphabetic order)
 */
// import * as accounts from './accounts';
// import * as app from './app';
// import * as auth from './auth';
// import * as config from './config';
// import * as contact from './contact';
// import * as containerManagement from './containerManagement';
// import * as containers from './containers';
// import * as datasetManagement from './datasetManagement';
// import * as datasets from './datasets';
// import * as files from './files';
// import * as fileUploads from './fileUploads';
// import * as graphs from './graphs';
// import * as imports from './imports';
// import * as prefixes from './prefixes';
import * as routing from './routing';
// import * as socket from './socket'
// import * as triples from './triples';
// import * as uploading from './uploading';
// import * as notifications from './notifications';
const transitImmutable = require('transit-immutable-js');

const transitHandler = transitImmutable.withRecords([
  // accounts.StateRecord,
  // app.StateRecord,
  // auth.StateRecord,
  // config.StateRecord,
  // contact.StateRecord,
  // containerManagement.ContainerManagementRecord,
  // datasetManagement.StateRecord,
  // datasets.DatasetRecord,
  // fileUploads.UploadRecord,
  routing.LocationRecord,
  routing.StateRecord,
  // socket.StateRecord,
  // uploading.UploadRecord,
  // notifications.NotificationRecord
], function(name:any,value:any):any{
  console.warn('missing record', name);
  return null;
})

import {GlobalState} from './'
export function toJs(state:any) {
  return transitHandler.toJSON(state);
}
export type GlobalStateAsJs = { [K in keyof GlobalState]: any }
export function fromJs(js:any) {
  if (typeof js === "string") {
    return transitHandler.fromJSON(js)
  } else {
    return js;
  }

}

/**
Keep in alphabetic order
**/
export interface GlobalState  extends Partial<reactRedux.ProviderProps> {
  // accounts: accounts.StateRecordInterface,
  // auth: auth.StateRecordInterface,
  // app: app.StateRecordInterface,
  // config: config.StateRecordInterface,
  // contact: contact.StateRecordInterface,
  // containerManagement:containerManagement.StateInterface,
  // containers:containers.StateInterface,
  // datasetManagement: datasetManagement.StateRecordInterface,
  // datasets: datasets.StateInterface,
  // files: files.StateInterface,
  // fileUploads: fileUploads.StateInterface,
  // graphs: graphs.StateInterface,
  // imports: imports.StateInterface,
  // notifications: notifications.StateInterface,
  // prefixes: prefixes.StateInterface,
  // triples: triples.StateInterface,
  // uploading: uploading.StateInterface,
  // socket: socket.StateRecordInterface,

  //the state managed by included libs such as react-router-redux
  reduxAsyncConnect:any,
  form: {[formName: string]: reduxForm.Form<any,any,any>},
  routing: routing.StateRecordInterface
}
const appReducer = Redux.combineReducers(<{ [K in keyof GlobalState]: any }>{
  /**
   * Keep in alphabetic order
   */
  // accounts: accounts.reducer,
  // app: app.reducer,
  // auth: auth.reducer,
  // config: config.reducer,
  // contact:contact.reducer,
  // containers:containers.reducer,
  // containerManagement:containerManagement.reducer,
  // datasetManagement: datasetManagement.reducer,
  // datasets: datasets.reducer,
  // files: files.reducer,
  // fileUploads: fileUploads.reducer,
  // graphs: graphs.reducer,
  // imports: imports.reducer,
  // notifications: notifications.reducer,
  // prefixes:prefixes.reducer,
  // socket:socket.reducer,
  // triples:triples.reducer,
  // uploading:uploading.reducer,

  //the state managed by included libs such as react-router-redux
  routing: routing.reducer,
  reduxAsyncConnect:reducer,
  form,
});
export var rootEpic = ReduxObservable.combineEpics(
  // ...socket.epics,
  // ...datasets.epics,
  // datasetManagement.epic,
  // graphs.epic,
);

//define some action properties that are exposed via our mw
export interface _GlobalActions<A = any> {
  types?: [A,A,A],
  type?: A,
  result?: any,
  meta?: ResponseMetaData,
  error?: string,
  message?: string,
  status?: number,
  promise?:(apiClient?:ApiClient) => Promise<any>,
  socket?:(socket:SocketClient) => any
}
//Need to merge it with a promise, as our promise MW might make it into one
//some of our async dispatched actions expect a thenable result
export type GlobalActions<A = any> = Partial<_GlobalActions<A>> & Partial<Promise<any>>;
export interface Thunk<A> {
  (dispatch:(action:A) => any, getState:()=>GlobalState): any
}




export default appReducer;
