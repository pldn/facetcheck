"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTemplate_1 = require("@triply/triply-node-utils/build/src/ConfigTemplate");
class Config extends ConfigTemplate_1.default {
    setDefaults() {
        this.internalPort = 5000;
        this.clientConnection = {
            ssl: false,
            publicPort: 5000,
            domain: "localhost"
        };
    }
    getDevServerPort() {
        return this.clientConnection.publicPort + 5;
    }
    validateEnvVariables() {
    }
    postProcess() {
    }
}
exports.Config = Config;
function getCurrentUrl(config, path, queryString) {
    return (Config.prototype.connectionToUrl(config.clientConnection) + (path ? path : "") + (queryString ? queryString : ""));
}
exports.getCurrentUrl = getCurrentUrl;
var config;
function getConfig() {
    if (!config) {
        config = new Config();
    }
    return config;
}
exports.getConfig = getConfig;
