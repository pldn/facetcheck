// require('ts-node').register()//we're including a ts config file, that has not yet been compiled
// Webpack config for development
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var appConfig = require("./_appConfig").getConfig();
var paths = require("./paths");
var WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
var getClientEnvironment = require("./env");
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
var LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const { removeEmpty, ifElse, merge, removeEmptyKeys } = require("./helpers");

const isDev = process.env.NODE_ENV !== "production";
const isProd = process.env.NODE_ENV === "production";
const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);

var host = appConfig.clientConnection.domain || "localhost";
var autoprefixer = require("autoprefixer");
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require("./webpack-isomorphic-tools")).development(
  isDev
);

//If you change this value, make sure to also update the postcss.config.js file
const SUPPORTED_BROWSERS = [
  "last 3 versions",
  //or
  "> 3%"
];
// Get enrivonment variables to inject into our app.
var env = getClientEnvironment();
module.exports = {
  stats: {
    chunks: false
  },
  //don't use eval in dev, but cheap-module-source-map. See https://github.com/facebookincubator/create-react-app/issues/920
  devtool: isDev ? "cheap-module-source-map" : false,
  context: paths.base,
  cache: isDev,
  entry: {
    main: removeEmpty([
      ifDev("react-hot-loader/patch"),
      require.resolve("./polyfills"),
      ifDev("webpack/hot/dev-server"),
      ifDev("webpack-dev-server/client?http://0.0.0.0:" + appConfig.getDevServerPort() + "/"),
      ifDev("bootstrap-loader", "bootstrap-loader/extractStyles"),
      //using a fork of the package font-awesome-webpack
      //the original one is not properly compatible with webpack2
      //see https://github.com/gowravshekar/font-awesome-webpack/issues/24
      "font-awesome-webpack2!./src/theme/font-awesome.config" + (isProd ? ".prod" : "") + ".js",
      paths.appIndexTs
    ])
  },
  output: {
    path: path.resolve(paths.assets),
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[chunkhash].js",
    //using dev server url. setting this to actual path will let webpack write files to disk
    //NOTE: using a _relative_ dist dir in production, so we can proxy to this webservice via a location directive
    //This relative path will create issues if we implement a multi-page facetcheck
    publicPath: isDev ? "http://" + host + ":" + appConfig.getDevServerPort() + "/dist/" : (process.env['BASENAME'] || '') + '/dist/'
  },
  resolve: {
    alias: {
      // leaflet_css: __dirname + "/../node_modules/leaflet/dist/leaflet.css",
      // leaflet_marker: __dirname + "/../node_modules/leaflet/dist/images/marker-icon.png",
      // leaflet_marker_2x: __dirname + "/../node_modules/leaflet/dist/images/marker-icon-2x.png",
      // leaflet_marker_shadow: __dirname + "/../node_modules/leaflet/dist/images/marker-shadow.png"
    },
    modules: [paths.src, paths.nodeModules],
    extensions: [".json", ".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: removeEmpty([
      {
        test: /\.tsx?$/,
        include: [paths.src],
        exclude: /__tests__/,
        loader: removeEmpty([
          ifDev("react-hot-loader/webpack"),
          isProd || process.env.WITH_BABEL
            ? {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "env",
                      {
                        targets: {
                          browsers: SUPPORTED_BROWSERS
                        }
                      }
                    ]
                  ]
                }
              }
            : undefined,
          {
            loader: "ts-loader",
            options: {
              configFileName: "tsconfig-build.json",
              transpileOnly: isDev
            }
          }
        ])
      },
      {
        test: /\.js$/,
        //node-modules is compiled to es6 (needed for immutable). Uglifying it won't work, so we need to transpile this on separately
        include: [paths.nodeModules + "/@triply/triply-node-utils"],
        loader: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "env",
                  {
                    targets: {
                      browsers: SUPPORTED_BROWSERS
                    }
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.scss$/,
        exclude: [paths.nodeModules],
        loader: isDev
          ? [
              {
                loader: "style-loader"
              },
              {
                loader: "css-loader",
                query: {
                  modules: true,
                  importLoaders: 2,
                  sourceMap: isDev,
                  localIdentName: "[name]__[local]___[hash:base64:5]"
                }
              },
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: isDev
                }
              },
              {
                loader: "sass-loader",
                query: {
                  outputStyle: "expanded",
                  sourceMap: isDev
                }
              }
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  query: {
                    modules: true,
                    importLoaders: 2
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    sourceMap: isDev
                  }
                },
                {
                  loader: "sass-loader",
                  query: {
                    outputStyle: "compressed"
                  }
                }
              ]
            })
      },
      {
        test: /\.less$/,
        exclude: [paths.nodeModules],
        loader: isDev
          ? [
              {
                loader: "style-loader"
              },
              {
                loader: "css-loader",
                query: {
                  modules: true,
                  importLoaders: 2,
                  sourceMap: isDev,
                  localIdentName: "[name]__[local]___[hash:base64:5]"
                }
              },
              {
                loader: "less-loader",
                query: {
                  outputStyle: "expanded",
                  sourceMap: isDev
                }
              }
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  query: {
                    modules: true,
                    importLoaders: 2
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    sourceMap: isDev
                  }
                },
                {
                  loader: "less-loader",
                  query: {
                    outputStyle: "compressed"
                  }
                }
              ]
            })
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.raw\..*$/,
        loader: "raw-loader"
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        exclude: /\.raw\./,
        options: {
          limit: 1000,
          mimetype: "image/svg+xml"
        }
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          mimetype: "application/font-woff"
        }
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          mimetype: "application/font-woff"
        }
      },
      // //Adding this will mess-up css loading of YASGUI in dev mode
      // //Dont think we actually need this css loader for other items, so just turn leave it off
      // // {
      // //   test: /\.css$/,
      // //   loader: "style-loader!css-loader"
      // // },
      // {
      //   test: /\.css$/,
      //   loader: "style-loader!css-loader"
      // },
      {
        test: /\.css$/,
        loader: isDev
          ? [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true, // default is false
                  sourceMap: true,
                  importLoaders: 1,
                  localIdentName: "[name]--[local]--[hash:base64:8]"
                }
              },
              "postcss-loader"
            ]
          : ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    modules: true, // default is false
                    importLoaders: 1
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    sourceMap: isDev
                  }
                }
              ]
            })
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          mimetype: "application/octet-stream"
        }
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression("images"),
        loader: "url-loader",
        options: {
          limit: 10240
        }
      }
    ])
  },
  plugins: removeEmpty([
    ifDev(
      new ForkTsCheckerWebpackPlugin({
        tsconfig: "tsconfig-build.json",
        watch: "./src/**/**.ts*",
        workers: 2
      })
    ),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/), //only english locale
    new webpack.LoaderOptionsPlugin({
      minimize: isProd,
      debug: false,
      options: {
        output: {
          //needed by resolve-url-loader somehow. this plugin does not read from the root output config block.
          //probably a webpack2 thing that is unsupported by this plugin yet
          path: paths.assets
        },
        context: paths.base
      }
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
    ifProd(
      new ExtractTextPlugin({
        filename: "[name]-[chunkhash].css",
        allChunks: true
      })
    ),
    // Used for requiring assets in a way that works within a node environment so that
    // you are able to bundle everything including your server together.
    // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
    // This is necessary to emit hot updates (currently CSS only):
    ifDev(new webpack.HotModuleReplacementPlugin()),
    // When there are errors while compiling this plugin skips the emitting
    // phase (and recording phase), so there are no assets emitted that include errors
    // http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    ifDev(new webpack.NoEmitOnErrorsPlugin()),
    ifDev(new webpack.IgnorePlugin(/webpack-stats\.json$/)),
    ifDev(new WebpackBuildNotifierPlugin()),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    ifDev(new WatchMissingNodeModulesPlugin(paths.appNodeModules)),

    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: isDev,
      __BASENAME__: process.env['BASENAME'] || '',
      __DEVTOOLS__: isDev // <-------- DISABLE redux-devtools HERE
    }),
    ifProd(new LodashModuleReplacementPlugin()),

    ifProd(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ),

    webpackIsomorphicToolsPlugin
  ]),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
