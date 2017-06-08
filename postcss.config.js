const autoprefixer = require('autoprefixer');
//If you change this value, make sure to also update the webpack config
const SUPPORTED_BROWSERS = [
  "last 3 versions",
  //or
  "> 3%"
];
const isDev = process.env.NODE_ENV !== "production";
module.exports = {
  plugins: () => [
    autoprefixer({ browsers: SUPPORTED_BROWSERS })
  ],
  sourceMap: isDev
}
