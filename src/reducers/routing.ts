import * as Immutable from "immutable";

import { LOCATION_CHANGE } from "react-router-redux";
import { GlobalState } from "reducers";
export interface JsState {
  locationBeforeTransitions: {
    pathname?: string;
    hash?: string;
    search?: string;
    query?: Object;
    state?: {
      dsPanelCollapsedSm: boolean;
    };
  };
}
export interface LocationState {
  pathname: string;
  hash: string;
  search: string;
  query: Object;
  state: {
    dsPanelCollapsedSm: boolean;
  };
}
export var LocationRecord = Immutable.Record<LocationState>(
  {
    pathname: "",
    hash: "",
    search: "",
    query: {},
    state: {
      dsPanelCollapsedSm: false
    }
  },
  "locationRecord"
);
export var StateRecord = Immutable.Record<JsState>({ locationBeforeTransitions: LocationRecord() }, "routing");

export var initialState = new StateRecord();
export type StateRecordInterface = typeof initialState;
export function reducer(state = initialState, action: any) {
  if (action.type === LOCATION_CHANGE) {
    return state.set("locationBeforeTransitions", action.payload);
  }
  return state;
}

export function createSelectLocationState() {
  let prevRoutingState: any, prevRoutingStateJS: any;
  return (state: GlobalState) => {
    const routingState: any = state.routing;
    if (typeof prevRoutingState === "undefined" || !prevRoutingState.equals(routingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }
    return prevRoutingStateJS;
  };
}
