//external dependencies
import * as React from 'react';
// if (process.env.NODE_ENV !== 'production') {
//   require('why-did-you-update').whyDidYouUpdate(React)
// }
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
// import { Router, browserHistory,match } from 'react-router';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-connect';
// import * as useScroll from 'scroll-behavior/lib/useStandardScroll';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
const {AppContainer} = require('react-hot-loader');
import createStore from 'redux/create';
import customTheme from 'muiTheme'
const {useScroll} = require('react-router-scroll')
import { Router, browserHistory,match,applyRouterMiddleware } from 'react-router';


//import own dependencies
import ApiClient from 'helpers/ApiClient';
import getRoutes from 'routes';
const client = new ApiClient(window.__data as any);
// const history = useScroll(() => browserHistory)();

const dest = document.getElementById('content');


declare var window:__App.ReactWindow;
declare var module:any;
const store = createStore(browserHistory, client, window.__data);
const syncedHistory = syncHistoryWithStore(browserHistory, store);
// function initSocket() {
//   const socket = io('', {path: '/ws'});
//   socket.on('news', (data:any) => {
//     socket.emit('my other event', { my: 'data from client' });
//   });
//   socket.on('msg', (data:any) => {
//     console.info('some message via socket???', data)
//   });
//
//   return socket;
// }

// global.socket = initSocket();

// const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider')

const getComponent = (renderProps:any = {}) => {
  return <Router {...renderProps} history={syncedHistory} render={(props:any) =>
          <ReduxAsyncConnect {...props} helpers={{client}} filter={(item:any) => !item.deferred} render={applyRouterMiddleware(useScroll())} />
        }>
      {getRoutes(store)}
    </Router>
}


const renderApp = () => {
  match({routes: getRoutes(store), history:syncedHistory as any}, (error, redirectLocation, renderProps) => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store} key="provider">
           <MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
             {getComponent(renderProps)}
          </MuiThemeProvider>
        </Provider>
      </AppContainer>,
      dest
    );
  })
}



if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, dest);
    }
  };
  module.hot.accept()
  module.hot.accept('./routes', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      ReactDOM.unmountComponentAtNode(dest);
      reRenderApp();
    });
  });
}
renderApp();
if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
}


declare var __DEVTOOLS__: boolean;
if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {getComponent()}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
