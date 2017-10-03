//external dependencies
import * as Immutable from "immutable";

//import own dependencies
// import {Actions as authActions} from './auth';
// import {Actions as accountActions} from './accounts';
// import {Actions as DatasetManagementActions} from './datasetManagement';
import { Actions as StatementActions } from "./statements";
// import {Actions as containerActions} from './containers';
// import {Actions as ContainerManagementActions} from './containerManagement';
// import {Actions as FileActions} from 'reducers/files'
// import {Actions as prefixActions} from './prefixes';
// import {Actions as TriplesActions} from './triples';
// import {Actions as UploadingActions} from './uploading';
import { ResponseMetaData } from "helpers/ApiClient";

export enum Actions {
  REMOVE_ALL = "triply/notifications/REMOVE_ALL" as any,
  REMOVE_ONE = "triply/notifications/REMOVE_ONE" as any
}

export enum NotificationType {
  INFO,
  SUCCESS,
  WARNING,
  ERROR
}

export interface NotificationRecordProps {
  type: NotificationType;
  title?: string;
  timeout: number;
  message: string;
  devMessage?: string;
  notificationKey?: string;
}
export var NotificationRecord = Immutable.Record<NotificationRecordProps>(
  {
    type: <NotificationType>null,
    title: <string>null,
    timeout: 10000,
    message: <string>null,
    devMessage: <string>null,
    notificationKey: <string>null
  },
  "notification"
);
// export type instance = Immutable.Record.Class<any>.
export type NotificationRecordInstance = Immutable.Record.Inst<NotificationRecordProps>;

export var initialState = Immutable.OrderedMap<string, NotificationRecordInstance>();

export type StateInterface = typeof initialState;
// const initialState:State = [
//     {type:NotificationType.INFO,title:'sometitle', message:'Some initialStatefo msgSome initialStatefo msgSome initialStatefo msgSome initialStatefo msgSome initialStatefo msgSome initialStatefo msgSome initialStatefo msgSome initialStatefo msg', devMessage: 'somedevmessage somedevmessage somedevmessagesomedevmessage somedevmessage somedevmessagesomedevmessage somedevmessage somedevmessagesomedevmessage somedevmessage somedevmessage', timeout:0,notificationKey:'12'},
//     {type:NotificationType.SUCCESS,title:'sometitle', message:'Sbcome info msg', timeout:2000,notificationKey:'13'},
//     {type:NotificationType.SUCCESS,title:'sometitle', message:'Sbcome iasnfo msg', timeout:0,notificationKey:'19'},
//     {type:NotificationType.SUCCESS, message:'Sbcome iasnfo msg', timeout:0,notificationKey:'129'},
//     {type:NotificationType.INFO,title:'sometitle', message:'Somase info masdsg', devMessage: 'sdf',timeout:0,notificationKey:'14'},
//     {type:NotificationType.SUCCESS,title:'sometitle', message:'Soas',timeout:0,notificationKey:'15'},
// ] as State;

export interface Action {
  type: any;
  message: string;
  status: number;
  devMessage: string;
  removeKey: string;
  meta: ResponseMetaData;
  files?: File[];
}
export function reducer(state = initialState, action: Action): StateInterface {
  const getNotificationWithKey = (notification: NotificationRecordProps): NotificationRecordInstance => {
    if (notification.notificationKey) return new NotificationRecord(notification);
    return new NotificationRecord({ ...notification, notificationKey: action.type + notification.message });
  };

  var succesMsg: string;
  switch (action.type) {
    //first deal with errors that aren't handled by other reducers
    // case StatementActions.GET_STATEMENTS_FAIL:
    //   if (action.message) {
    //     const notification = getNotificationWithKey({
    //       type: NotificationType.ERROR,
    //       message: action.message,
    //       timeout: 10000,
    //       devMessage: action.devMessage
    //     });
    //     return state.set(notification.notificationKey, notification);
    //   }
    //   return state;
    //
    // some notification management actions
    case Actions.REMOVE_ONE:
      return state.remove(action.removeKey);
    case Actions.REMOVE_ALL:
      return state.clear();
    default:
      if (succesMsg) {
        const notification = getNotificationWithKey({
          type: NotificationType.SUCCESS,
          message: "Account verified",
          timeout: 10000
        });
        return state.set(notification.notificationKey, notification);
      }
      return state;
  }
}

export function removeNotification(notificationKey: string): any {
  return {
    type: Actions.REMOVE_ONE,
    removeKey: notificationKey
  };
}
export function clean() {
  return {
    type: Actions.REMOVE_ALL
  };
}
