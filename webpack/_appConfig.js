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
        this.serverConnection = {
            ssl: false,
            publicPort: 5000,
            domain: "localhost"
        };
        this.sparqlEndpoint = {
            url: "https://api.krr.triply.cc/datasets/wbeek/geosoup/containers/endpoint1/sparql",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmtub3duIiwiaXNzIjoidHJpcGx5LmNjIiwianRpIjoiMzk0YTg0MWItNTlmMy00YzhiLWJhOTYtZDc2OWUyZjgzM2E3Iiwic2MiOnsiYWNjIjpbImEiXSwiZHMiOlsiYSJdLCJ1cyI6WyJhIl0sInRvayI6WyJhIl19LCJ1aWQiOiI1OTUwZTNmZmVjZDEwZDAxN2Y2YmNjMjEiLCJpYXQiOjE1MDUxMzMzNzN9.8w9nW9l_LupmgcRnNpn3eDWISUfFcp3-USdqtKuHe4o"
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
