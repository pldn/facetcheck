//external dependencies
import * as _ from 'lodash';
//import own dependencies
import {Config, getConfig} from 'staticConfig'
// import {Routes, Models} from 'Contract'
import ApiClient from 'helpers/ApiClient'
import {GlobalState} from 'reducers'
import {Helmet as ReactHelmet} from 'react-helmet'
import * as Immutable from 'immutable'
// import {Actions as PrefixActions} from 'reducers/prefixes'
export enum Actions {
  GET_CONFIG = 'triply/config/CONFIG_CONFIG' as any,
  GET_CONFIG_SUCCESS = 'triply/config/GET_CONFIG_SUCCESS' as any,
  GET_CONFIG_FAIL = 'triply/config/GET_CONFIG_FAIL' as any,
  // UPLOAD_LOGO = 'triply/app/UPLOAD_LOGO' as any,
  // UPLOAD_LOGO_SUCCESS = 'triply/app/UPLOAD_LOGO_SUCCESS' as any,
  // UPLOAD_LOGO_FAIL = 'triply/app/UPLOAD_LOGO_FAIL' as any,
  // UPDATE_APPLICATION_CONFIG = 'triply/app/UPDATE_APPLICATION_CONFIG' as any,
  // UPDATE_APPLICATION_CONFIG_SUCCESS = 'triply/app/UPDATE_APPLICATION_CONFIG_SUCCESS' as any,
  // UPDATE_APPLICATION_CONFIG_FAIL = 'triply/app/UPDATE_APPLICATION_CONFIG_FAIL' as any,
  // UPDATE_AUTH_SETTINGS = 'triply/app/UPDATE_AUTH_SETTINGS' as any,
  // UPDATE_AUTH_SETTINGS_SUCCESS = 'triply/app/UPDATE_AUTH_SETTINGS_SUCCESS' as any,
  // UPDATE_AUTH_SETTINGS_FAIL = 'triply/app/UPDATE_AUTH_SETTINGS_FAIL' as any,
  // UPDATE_APP_SETTINGS = 'triply/app/UPDATE_APP_SETTINGS' as any,
  // UPDATE_APP_SETTINGS_SUCCESS = 'triply/app/UPDATE_APP_SETTINGS_SUCCESS' as any,
  // UPDATE_APP_SETTINGS_FAIL = 'triply/app/UPDATE_APP_SETTINGS_FAIL' as any,
}
// import {ClientConfig} from 'Contract/Models'


// export type ClientConfig = ClientConfig
export var StateRecord = Immutable.Record({
  staticConfig: <Config>(__SERVER__?JSON.parse(JSON.stringify(getConfig())):null),
  // clientConfig: <ClientConfig>null
}, 'config')
export var initialState = new StateRecord()
export type StateRecordInterface = typeof initialState

//reducer: take a state and action, and return new state
//Given the same arguments, it should calculate the next state and return it. No surprises. No side effects. No API calls. No mutations. Just a calculation.
export function reducer(state = initialState, action:any):StateRecordInterface {

  switch (action.type) {
    // case Actions.GET_CONFIG_SUCCESS:
    // case Actions.UPLOAD_LOGO_SUCCESS:
    // case Actions.UPDATE_APPLICATION_CONFIG_SUCCESS:
    // case Actions.UPDATE_AUTH_SETTINGS_SUCCESS:
    // case Actions.UPDATE_APP_SETTINGS_SUCCESS:
    //   return state.set('clientConfig', action.result)
    // case PrefixActions.UPDATE_GLOBAL_PREFIXES_SUCCESS:
    //   return state.update('clientConfig', (c) => ({...c, prefixes : action.result}));
    default:
      return state;
  }
}


export function getPageMetadata():ReactHelmet.HelmetProps {

  return {
    htmlAttributes: {
      lang: 'en'
    },
    titleTemplate: '%s - FacetCheck',
    defaultTitle: 'FacetCheck',
    meta: [
      {name: 'description', content: 'FacetCheck'},
      {charset: 'utf-8'},
      {property: 'og:site_name', content: 'FacetCheck'},
      // {property: 'og:image', content: clientConfig.branding.logo},
      {property: 'og:locale', content: 'en_US'},
      {property: 'og:title', content:'FacetCheck'},
      {property: 'og:description', content: 'FacetCheck'},
      {property: 'og:site', content: 'FacetCheck'},
      {property: 'og:creator', content: 'triply.cc'},
    ]
  }
}
