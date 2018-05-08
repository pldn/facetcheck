//external dependencies
import * as React from "react";
// if (process.env.NODE_ENV !== 'production') {
//   require('why-did-you-update').whyDidYouUpdate(React)
// }
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import { Router, browserHistory,match } from 'react-router';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncHistoryWithStore } from "react-router-redux";
import { ReduxAsyncConnect } from "redux-connect";
// import * as useScroll from 'scroll-behavior/lib/useStandardScroll';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const { AppContainer } = require("react-hot-loader");
import createStore from "./store/create";
import customTheme from "./muiTheme";
const { useScroll } = require("react-router-scroll");
import { fromJs } from "./reducers";
import { createSelectLocationState } from "./reducers/routing";
import { Router, browserHistory, match, applyRouterMiddleware } from "react-router";

//import own dependencies
import ApiClient from "./helpers/ApiClient";
import getRoutes from "./routes";

const client = new ApiClient(fromJs(window.__data));
// const history = useScroll(() => browserHistory)();

const dest = document.getElementById("app");

declare var window: __App.ReactWindow;
declare var module: any;
const store = createStore(browserHistory, client, fromJs(window.__data));

const syncedHistory = syncHistoryWithStore(browserHistory as any, store as any, {
  selectLocationState: createSelectLocationState()
});

// const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider')

const getComponent = (renderProps: any = {}) => {
  //STRANGE: removing this line makes ReduxAsyncConnect undefined (crashing our client)
  //perhaps a tree-shaking issue with webpack2
  ReduxAsyncConnect;
  return (
    <Router
      {...renderProps}
      history={syncedHistory as any}
      render={(props: any) =>
        (
          <ReduxAsyncConnect
            {...props}
            helpers={{ client }}
            filter={(item: any) => !item.deferred}
            render={applyRouterMiddleware(useScroll())}
          />
        ) as any}
    >
      {getRoutes(store)}
    </Router>
  );
};
declare const __BASENAME__:string
const renderApp = () => {
  match({ routes: getRoutes(store), basename:__BASENAME__ || "" , history: syncedHistory as any }, (error, redirectLocation, renderProps) => {
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
  });
};

if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {
      const RedBox = require("redbox-react").default;

      ReactDOM.render(<RedBox error={error} />, dest);
    }
  };
  module.hot.accept();
  module.hot.accept("./routes", () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      ReactDOM.unmountComponentAtNode(dest);
      reRenderApp();
    });
  });
}
renderApp();
if (process.env.NODE_ENV !== "production") {
  window.React = React; // enable debugger
}
