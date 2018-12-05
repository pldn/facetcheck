if (typeof (<any>window).Promise === "undefined") {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require("promise/lib/rejection-tracking").enable();
  (<any>window).Promise = require("promise/lib/es6-extensions.js");
}

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
(<any>Object).assign = require("object-assign");
