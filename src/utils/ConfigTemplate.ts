// import * as CacheBuster from './src/helpers/Cachebuster';
// import * as Mailer from './helpers/mailer';
import * as _ from "lodash";

export function getEnvironmentVarsAsObject(envPrefix: string) {
  if (!process || !process.env || _.size(process.env) === 0) {
    // console.trace("WARNING: No environment variables set. Config cannot be overwritten by env");
    return;
  }
  var autocast = require("autocast");
  const values = {};
  for (let envKey in process.env) {
    //should we store this env var in the config:
    if (_.startsWith(envKey, envPrefix)) {
      //simply casting. So far, not using vals such as dates that might get misinterpreted
      let val: any = autocast(process.env[envKey]);
      envKey = envKey.substring(envPrefix.length);
      //read env variables, and store in config. E.g. TRIPLY__MAIL__REPLY_TO = 'bla'
      //i.e., splits by __, changes to camelcase, and set in config
      _.set(values, _.map(envKey.split("__"), _.camelCase), val);
    }
  }
  return values;
}
abstract class Config {
  isDevelopment = process.env.NODE_ENV !== "production";
  constructor() {
    this.validateEnvVariables();

    //set before other defaults, as some values may inherit from others
    this.setFromEnvironment();

    this.setDefaults();

    //also set from env after defaults, to overwrite them
    this.setFromEnvironment();

    this.postProcess();
  }
  abstract validateEnvVariables(): void;
  abstract setDefaults(): void;
  abstract postProcess(): void;
  setFromEnvironment() {
    _.merge(this, getEnvironmentVarsAsObject("TRIPLY__"));
  }
}
export default Config;
