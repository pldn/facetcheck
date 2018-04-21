//external dependencies
import "source-map-support/register";
import * as _ from "lodash";
import * as Express from "express";
import * as React from "react";
import * as ReactDOM from "react-dom/server";
let httpProxy = require("http-proxy");
import * as path from "path";
import createStore from "./store/create";
let PrettyError = require("pretty-error");
import * as http from "http";
import { match } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
let { ReduxAsyncConnect, loadOnServer } = require("redux-connect");
let createHistory = require("react-router/lib/createMemoryHistory");
import { Provider } from "react-redux";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { createSelectLocationState } from "./reducers/routing";
//see https://github.com/zilverline/react-tap-event-plugin. Can probably
//remove this dep for a future version of react. Need this for the material-ui
//dependency
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
//import own dependencies
import { getConfig } from "./staticConfig";
import ApiClient from "./helpers/ApiClient";
import Html from "./helpers/Html";
import getRoutes from "./routes";
import customTheme from "./muiTheme";
var favicon = require('serve-favicon');
declare var __DEVELOPMENT__: boolean;
declare var __BASENAME__:string;
const config = getConfig();
// const targetUrl = "http://" + config.clientConnection.domain + ":" + config.clientConnection.publicPort;
const pretty = new PrettyError();
const app = Express();
const server = http.createServer(app);

/**
setup Proxy. Ideally we would call the api server directly, but we'll get into CORS
and cookie issues...
**/
// const proxy = httpProxy.createProxyServer({
//   // target: targetUrl
//   // ws: true//websocket support
// });
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(Express.static(path.join(__dirname, "..", "assets")));
app.use(favicon('./public/images/favicon.ico'));
// Proxy to API server
// app.use("/sparql", (req: Express.Request, res: Express.Response) => {
//   proxy.web(req, res, { target: "http://lod.labs.vu.nl:8899/sparql" });
// });
// // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
// proxy.on("error", (error: any, req: Express.Request, res: Express.Response) => {
//   let json: any;
//   if (error.code !== "ECONNRESET") {
//     console.error("proxy error", error);
//   }
//   if (!res.headersSent) {
//     res.writeHead(500, { "content-type": "application/json" });
//   }
//   json = { error: "proxy_error", reason: error.message };
//   res.end(JSON.stringify(json));
// });
declare var global: any;


app.use((req: Express.Request, res: Express.Response) => {
  //we need the useragent for MUI-theme to work on the server...
  //see https://github.com/callemall/material-ui/blob/599a5327a015147699e6ef742b1939426b6b8d0b/docs/src/app/components/pages/get-started/serverRendering.md
  global.navigator = global.navigator || {};
  global.navigator.userAgent = req.headers["user-agent"] || "all";


  const client = new ApiClient({} as any, req);
  const history = createHistory(req.originalUrl);

  const store = createStore(history, client);

  function hydrateOnClient() {
    res.send(
      "<!doctype html>\n" + ReactDOM.renderToString(<Html store={store} />)
    );
  }

    hydrateOnClient();
    return;
});

if (config.internalPort) {
  server.listen(config.internalPort, (err: any) => {
    if (err) {
      console.error(err);
    }
    console.info(
      "==> 💻  Open http://%s:%s in a browser to view the app.",
      config.clientConnection.domain,
      config.clientConnection.publicPort
    );
  });
} else {
  console.error("==>     ERROR: No PORT environment variable has been specified");
}
