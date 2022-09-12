// Webpack config for development
import * as path from "path";
import * as webpack from "webpack";
import * as paths from "./paths";

var WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import getClientEnvironment from "./env";
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");
import * as LodashModuleReplacementPlugin from "lodash-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { removeEmpty, ifElse } from "./helpers";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
const isDev = process.env.NODE_ENV !== "production";
const isProd = process.env.NODE_ENV === "production";
const bgImage = require("postcss-bgimage"); //remove url reference in bgimage (as is done by leaflet)
const ifDev = ifElse(isDev);
const ifProd = ifElse(isProd);
var HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
import * as autoprefixer from "autoprefixer";
var TerserPlugin = require("terser-webpack-plugin");
import * as OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

// Get enrivonment variables to inject into our app.
var env = getClientEnvironment();
const babelLoader = {
  loader: "babel-loader",
  options: {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: ["last 3 versions", "> 1%"]
        }
      ]
    ]
  }
};

interface StyleLoaderConf {
  isDev: boolean;
  useModule: boolean;
  moduleExt?: string;
  ext: string;
  onlyInclude?: Array<RegExp>;
}
function getStyleLoader(conf: StyleLoaderConf): webpack.RuleSetRule {
  const ext = "\\" + conf.ext + "$";
  const moduleExt = "\\" + conf.moduleExt + ext;
  const test = new RegExp(conf.moduleExt ? moduleExt : ext);
  const ignore: Array<string | RegExp> = [];
  if (!conf.useModule) {
    ignore.push(new RegExp(moduleExt));
  }
  const loaders: webpack.RuleSetUse = [];

  loaders.push(
    conf.isDev
      ? {
          loader: "style-loader"
        }
      : MiniCssExtractPlugin.loader
  );

  loaders.push({
    loader: "css-loader",
    query: {
      importLoaders: 2,
      modules: conf.useModule,
      sourceMap: conf.isDev,
      localIdentName: conf.useModule ? "[name]__[local]___[hash:base64:5]" : undefined
    }
  });
  loaders.push({
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      sourceMap: conf.isDev,
      plugins: () => [autoprefixer(), bgImage({ mode: "cutter" })]
    }
  });
  if (conf.ext.indexOf("scss") >= 0) {
    loaders.push({
      loader: "sass-loader",
      query: {
        outputStyle: "expanded",
        sourceMap: conf.isDev
      }
    });
  }
  const loader: webpack.RuleSetRule = {
    test: test,
    exclude: ignore,
    loader: loaders
  };
  if (conf.onlyInclude) loader.include = conf.onlyInclude;
  return loader;
}
console.log();
const conf: webpack.Configuration = {
  stats: {
    chunks: false
  },
  //don't use eval in dev, but cheap-module-source-map. See https://github.com/facebookincubator/create-react-app/issues/920
  devtool: isDev ? "cheap-module-source-map" : false,
  context: paths.base,
  mode: isProd ? "production" : "development",
  cache: isDev,
  optimization: {
    minimizer: isDev
      ? []
      : [
          new TerserPlugin({
            sourceMap: true
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
  },
  entry: {
    main: removeEmpty([require.resolve("./polyfills.ts"), paths.appIndexTs])
  },
  output: {
    path: path.resolve(paths.assets),
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[chunkhash].js",
    publicPath: process.env.BASENAME ? process.env.BASENAME + "/" : ""
    //using dev server url. setting this to actual path will let webpack write files to disk
    //NOTE: using a _relative_ dist dir in production, so we can proxy to this webservice via a location directive
    //This relative path will create issues if we implement a multi-page facetcheck
  },
  resolve: {
    alias: {
      "@triplydb/facetcheck/build/src": path.resolve(__dirname, "..", "src")
      // leaflet_css: __dirname + "/../node_modules/leaflet/dist/leaflet.css",
      // leaflet_marker: __dirname + "/../node_modules/leaflet/dist/images/marker-icon.png",
      // leaflet_marker_2x: __dirname + "/../node_modules/leaflet/dist/images/marker-icon-2x.png",
      // leaflet_marker_shadow: __dirname + "/../node_modules/leaflet/dist/images/marker-shadow.png"
    },
    modules: [paths.src, "node_modules"],
    extensions: [".json", ".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: removeEmpty<webpack.RuleSetRule>([
      {
        test: /\.(j|t)sx?$/,
        exclude: [/__tests__/, /node_modules/],
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              ["@babel/preset-env"],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties"],
              "react-hot-loader/babel"
            ]
          }
        }
      },{
        test:/\.js/,
        include: [/superagent/],
        use: [babelLoader]
      },
      {
        oneOf: [
          getStyleLoader({
            isDev: isDev,
            useModule: true,
            moduleExt: ".module",
            ext: ".scss"
          }),
          getStyleLoader({
            isDev: isDev,
            useModule: true,
            moduleExt: ".module",
            ext: ".css"
          }),
          getStyleLoader({
            isDev: isDev,
            useModule: false,
            ext: ".scss"
          }),
          //separate style loader for react toolbox (doesnt follow *.module.* pattern as expected)
          getStyleLoader({
            isDev: isDev,
            useModule: true,
            ext: ".css",
            onlyInclude: [/react-toolbox/]
          }),
          getStyleLoader({
            isDev: isDev,
            useModule: false,
            ext: ".css"
          })
        ]
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
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          mimetype: "application/octet-stream"
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
    ifProd(new MiniCssExtractPlugin()),
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
    // If you require a missing module and then `yarn install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    ifDev(new WatchMissingNodeModulesPlugin(paths.nodeModules)),

    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: isDev,
      __BASENAME__: process.env.BASENAME ? JSON.stringify(process.env["BASENAME"]) : JSON.stringify(""),
      __DEVTOOLS__: isDev // <-------- DISABLE redux-devtools HERE
    }),
    ifProd(new LodashModuleReplacementPlugin()),

    new HtmlWebpackPlugin({
      template: "./src/template.html"
    }),
    new HtmlWebpackIncludeAssetsPlugin({ assets: [], append: true })
  ]),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
export default conf;
