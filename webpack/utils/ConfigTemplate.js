"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function getEnvironmentVarsAsObject(envPrefix) {
    if (!process || !process.env || _.size(process.env) === 0) {
        console.trace("WARNING: No environment variables set. Config cannot be overwritten by env");
        return;
    }
    var autocast = require("autocast");
    const values = {};
    for (let envKey in process.env) {
        if (_.startsWith(envKey, envPrefix)) {
            let val = autocast(process.env[envKey]);
            envKey = envKey.substring(envPrefix.length);
            _.set(values, _.map(envKey.split("__"), _.camelCase), val);
        }
    }
    return values;
}
exports.getEnvironmentVarsAsObject = getEnvironmentVarsAsObject;
class Config {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV !== "production";
        this.validateEnvVariables();
        this.setFromEnvironment();
        this.setDefaults();
        this.setFromEnvironment();
        this.postProcess();
    }
    setFromEnvironment() {
        _.merge(this, getEnvironmentVarsAsObject("TRIPLY__"));
    }
}
exports.default = Config;
