//external dependencies
import * as Immutable from "immutable";

//import own dependencies
import { GlobalState } from "./";

export enum Actions {
  SET_ROOT_CLASS = "triply/app/TOGGLE_CLASS" as any,
  //Toggling of the panel on small screens is stored in react-router part of the state,
  //as this way we can use the browserhistory api to toggle the panel (e.g. when using the browser back btn)
  TOGGLE_DS_PANEL_COLLAPSE_LG = "triply/app/TOGGLE_DS_PANEL_COLLAPSE_LG" as any
}

export var StateRecord = Immutable.Record(
  {
    className: <string>null,
    dsPanelCollapsedLg: false
  },
  "app"
);
export var initialState = new StateRecord();
export type StateRecordInterface = typeof initialState;

export function reducer(state = initialState, action: any): StateRecordInterface {
  switch (action.type) {
    case Actions.SET_ROOT_CLASS:
      return state.set("className", action.className);
    case Actions.TOGGLE_DS_PANEL_COLLAPSE_LG:
      return state.set("dsPanelCollapsedLg", !state.dsPanelCollapsedLg);
    default:
      return state;
  }
}

export function setRootClassname(className: string): any {
  return {
    type: Actions.SET_ROOT_CLASS,
    className: className
  };
}

export function toggleDsPanelCollapseLg(): any {
  return {
    type: Actions.TOGGLE_DS_PANEL_COLLAPSE_LG
  };
}
export function isCollapsedSm(state: GlobalState) {
  return (
    !state.routing.locationBeforeTransitions ||
    !state.routing.locationBeforeTransitions.state ||
    !!state.routing.locationBeforeTransitions.state.dsPanelCollapsedSm
  );
}
