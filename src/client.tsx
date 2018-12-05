//external dependencies
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import * as useScroll from 'scroll-behavior/lib/useStandardScroll';
require('./theme/theme.scss');
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const { AppContainer } = require("react-hot-loader");
import createStore from "./store/create";
import customTheme from "./muiTheme";
import * as Containers from "./containers";
//import own dependencies
import ApiClient from "./helpers/ApiClient";

const client = new ApiClient();
// const history = useScroll(() => browserHistory)();

const dest = document.getElementById("app");

declare var window: __App.ReactWindow;
const store = createStore(client);

// const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider')
const renderApp = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store} key="provider">
        <MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
          <Containers.App />
        </MuiThemeProvider>
      </Provider>
    </AppContainer>,
    dest
  );
};

// if (module.hot) {
//   module.hot.accept();
// }
renderApp();
if (process.env.NODE_ENV !== "production") {
  window.React = React; // enable debugger
}
