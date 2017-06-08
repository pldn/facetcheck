import {default as ConfigTemplate, ConnectionConfig} from '@triply/triply-node-utils/build/src/ConfigTemplate'
export interface Iapp {
  title: string,
  description: string,
  head: {
    titleTemplate: string,
    meta: any[]
  }
}

export type ConnectionConfig = ConnectionConfig
/**
Get most of the config from a server '/info' request. We need some information before we can make that request though.
So, we're putting that part in this config
**/
export class Config extends ConfigTemplate {

  public internalPort:number;
  public serverConnection: ConnectionConfig;
  public clientConnection: ConnectionConfig;
  public serverConnectionFromBrowser: ConnectionConfig
  public onlyLandingPage: boolean;
  public hideLandingPage: boolean;
  setDefaults() {
    this.internalPort = 5000;
    this.serverConnection = {
      ssl: true,
      publicPort: 80,
      domain: 'triply.cc',
    }
    this.serverConnectionFromBrowser = {
      ssl: true,
      publicPort: 80,
      domain: 'triply.cc',
    }
    this.clientConnection = {
      ssl: true,
      publicPort: 80,
      domain: 'triply.cc',
    }
    this.onlyLandingPage = false;
    this.hideLandingPage = false;
  }

  getDevServerPort() {
    return this.clientConnection.publicPort + 5;
  }

  validateEnvVariables() {
    //just a template. nothing to validate atm.
    //automatically called from constructor
  }
  postProcess() {
    //nothing to do here
  }
  // getCurrentUrl(path?:string, queryString?:string) {
  //    return getCurrentUrl(this, path, queryString);
  //  }

}
export function getCurrentUrl(config:Config, path?:string,queryString?:string) {
  return Config.prototype.connectionToUrl(config.clientConnection) + (path?path:'') + (queryString?queryString:'');
}

var config:Config;
export function getConfig() {
  if (!config) {
    config = new Config();
  }
  return config;
}
