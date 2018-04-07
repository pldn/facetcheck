import { default as ConfigTemplate, ConnectionConfig } from "@triply/triply-node-utils/build/src/ConfigTemplate";
export interface Iapp {
  title: string;
  description: string;
  head: {
    titleTemplate: string;
    meta: any[];
  };
}

export type ConnectionConfig = ConnectionConfig;
/**
Get most of the config from a server '/info' request. We need some
information before we can make that request though.  So, we're putting
that part in this config
**/
export class Config extends ConfigTemplate {
  public sparqlEndpoint: {
    url: string;
    token?: string;
  };
  public internalPort: number;
  public clientConnection: ConnectionConfig;
  public serverConnectionFromBrowser: ConnectionConfig;
  setDefaults() {
    this.internalPort = 5000;
    this.clientConnection = {
      ssl: false,
      publicPort: 5000,
      domain: "localhost"
    };
    this.sparqlEndpoint = {
      url: "https://triply.eculture.labs.vu.nl/sparql"
    }
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
export function getCurrentUrl(config: Config, path?: string, queryString?: string) {
  return (
    Config.prototype.connectionToUrl(config.clientConnection) + (path ? path : "") + (queryString ? queryString : "")
  );
}

var config: Config;
export function getConfig() {
  if (!config) {
    config = new Config();
  }
  return config;
}
