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
        this.sparqlEndpoint = {
            url: "https://api.krr.triply.cc/datasets/Kadaster/geosoup/containers/endpoint/sparql",
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmtub3duIiwiaXNzIjoidHJpcGx5LmNjIiwianRpIjoiNzNjYzkzMjktNmFlYy00ZGM0LWJmMGUtNmIyMWQ5MDM4MGQyIiwic2MiOnsiYWNjIjpbImEiXSwiZHMiOlsiYSJdLCJ1cyI6WyJhIl0sInRvayI6WyJhIl19LCJ1aWQiOiI1OTUwZTNmZmVjZDEwZDAxN2Y2YmNjMjEiLCJpYXQiOjE1MDk0MDM0MTd9.5SxqdKTJMV-VZZBDkiZX-OW5ddkctwLHg9SHiLDNCH8"
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
