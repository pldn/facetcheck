//external dependencies
import 'source-map-support/register';
import * as _ from 'lodash';
import * as Express from 'express';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import * as favicon from 'serve-favicon';
let httpProxy = require('http-proxy');
import * as path from 'path';
import createStore from 'redux/create';
let PrettyError = require('pretty-error');
import * as http from 'http';
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
let { ReduxAsyncConnect, loadOnServer } = require('redux-connect');
let createHistory = require('react-router/lib/createMemoryHistory');
import {Provider} from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
//see https://github.com/zilverline/react-tap-event-plugin. Can probably
//remove this dep for a future version of react. Need this for the material-ui
//dependency
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin()
//import own dependencies
import {getConfig} from 'staticConfig';
import ApiClient from 'helpers/ApiClient';
import Html from 'helpers/Html';
import getRoutes from 'routes';
import customTheme from 'muiTheme'

declare var __DEVELOPMENT__: boolean;
declare var __DISABLE_SSR__: boolean;
__DISABLE_SSR__ = true;
const config = getConfig();
const targetUrl = 'http://' + config.serverConnection.domain + ':' + config.serverConnection.publicPort;
const pretty = new PrettyError();
const app = Express();
const server = http.createServer(app);


/**
setup Proxy. Ideally we would call the api server directly, but we'll get into CORS
and cookie issues...
**/
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  // ws: true//websocket support
});

app.use(favicon(path.join(__dirname, '..', 'assets', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'assets')));

// Proxy to API server
app.use('/sparql', (req:Express.Request, res:Express.Response) => {
    proxy.web(req, res, {target: 'http://lod.labs.vu.nl:8899/sparql'});
});
// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error:any, req:Express.Request, res:Express.Response) => {
  let json:any;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }
  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});
declare var webpackIsomorphicTools: any;
declare var global: any;
app.use((req:Express.Request, res:Express.Response) => {
  //we need the useragent for MUI-theme to work on the server...
  //see https://github.com/callemall/material-ui/blob/599a5327a015147699e6ef742b1939426b6b8d0b/docs/src/app/components/pages/get-started/serverRendering.md
  global.navigator = global.navigator || {};
  global.navigator.userAgent = req.headers['user-agent'] || 'all';


  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  const client = new ApiClient({} as any, req);
  const history = createHistory(req.originalUrl);

  const store = createStore(history, client);

  const syncedHistory = syncHistoryWithStore(history, store);
  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    console.warn('Server side rendering disabled!')
    hydrateOnClient();
    return;
  }
  // match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
  var bla:any = { syncedHistory, routes: getRoutes(store), location: req.originalUrl };
  match(bla, (error:any, redirectLocation:any, renderProps:any) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {

      // loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
      loadOnServer( _.merge({}, renderProps, {store, helpers: {client}})).then(() => {
        const component = (
          <Provider store={store} key="provider">
              <MuiThemeProvider muiTheme={getMuiTheme(_.assign({}, customTheme, {userAgent: req.headers['user-agent']}))}>
                <ReduxAsyncConnect {...renderProps} />
             </MuiThemeProvider>
          </Provider>
        );

        res.status(200);

        //used for muitheme
        global.navigator = {userAgent: req.headers['user-agent']};
        try {
          res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
        } catch(e) {
          if (__DEVELOPMENT__) {
            const RedBox = require('redbox-react').default;
            // ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={<RedBox error={e} />} store={store}/>));
            // res.send(ReactDOM.renderToString(<RedBox error={e} />));
            res.send(ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={<RedBox error={e} />} store={store}/>))
          } else {
            res.send('Something went really wrong here.. Please try again.')
          }
        }
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.internalPort) {
  server.listen(config.internalPort, (err:any) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  react frontend is running, talking to API server on http://%s:%s.', config.serverConnection.domain, config.serverConnection.publicPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.clientConnection.domain, config.clientConnection.publicPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
