var path = require("path");
var paths = require("./paths");
var appConfig = require("./_appConfig").getConfig();
// var rootDir = path.resolve(__dirname, '..');
var buildDir = path.resolve(__dirname, "..", "build");

var webpackConfig = require("./config");

var host = "0.0.0.0";
// var port = appConfig.devServerPort;
var port = appConfig.getDevServerPort();
var serverOptions = {
  // contentBase: 'http://' + host + ':' + port,
  proxy: {
    "*": "http://" + host + ":" + port
  },
  quiet: false,
  noInfo: true,
  hot: false, //don't set this to true. Already setting this in the dev config.
  //setting it more than once may result in errors:
  // https://github.com/webpack/style-loader/issues/53
  //people here disagree though:
  //https://github.com/webpack/webpack-dev-server/issues/97
  //In our case, hot reloading does not work actually refresh the page when hot is set to true
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { "Access-Control-Allow-Origin": "*" },
  disableHostCheck: true,
  // noCredentials: true,
  historyApiFallback: true,
  stats: { colors: true },
  overlay: {
    errors: true,
    warnings: true
  }
};

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./config.js");
new WebpackDevServer(webpack(config), serverOptions).listen(port, host, function(err, result) {
  if (err) {
    return console.error(err);
  }

  console.info("==> 🚧  Webpack development server listening on port %s", port);
});
