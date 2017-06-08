if (typeof Promise === "undefined") {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require("promise/lib/rejection-tracking").enable();
  window.Promise = require("promise/lib/es6-extensions.js");
}

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require("object-assign");

//see https://github.com/zilverline/react-tap-event-plugin. Can probably
//remove this dep for a future version of react. Need this for the material-ui
//dependency
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
