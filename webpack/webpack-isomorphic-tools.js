var WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");
var path = require("path");
var paths = require("./paths");
// var buildDir = path.resolve(paths.base);
// var buildDir = path.resolve(rootDir, 'build');
// see this link for more info on what all of this means
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
module.exports = {
  // when adding "js" extension to asset types
  // and then enabling debug mode, it may cause a weird error:
  //
  // [0] npm run start-prod exited with code 1
  // Sending SIGTERM to other processes..
  //
  debug: false,
  // webpack_assets_file_path: path.resolve(paths.base, 'webpack-assets.json'),
  webpack_assets_file_path: path.resolve(paths.base, "build", "webpack-assets.json"),
  webpack_stats_file_path: path.resolve(paths.base, "build", "webpack-stats.json"),
  //serve webpack-assets from memory via http, instead of saving it to file.
  //in our case, we're getting errors that the server can't connect to this port.
  //so, just don't use it for now
  // port:8484,
  assets: {
    images: {
      extensions: ["jpeg", "jpg", "png", "gif"],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser
    },
    fonts: {
      extensions: ["woff", "woff2", "ttf", "eot"],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser
    },
    svg: {
      extension: "svg",
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser
    },
    // this whole "bootstrap" asset type is only used once in development mode.
    // the only place it's used is the Html.js file
    // where a <style/> tag is created with the contents of the
    // './src/theme/bootstrap.config.js' file.
    // (the aforementioned <style/> tag can reduce the white flash
    //  when refreshing page in development mode)
    //
    // hooking into 'js' extension require()s isn't the best solution
    // and I'm leaving this comment here in case anyone finds a better idea.
    style_modules: {
      extensions: ["less", "scss"],
      filter: function(module, regex, options, log) {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          return regex.test(module.name);
        }
      },
      path: function(module, options, log) {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          return module.name;
        }
      },
      parser: function(module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
        } else {
          if (options.debug) {
            log.info("# module name", module.name);
            log.info("# module source", module.source);
            log.info("# project path", options.project_path);
            log.info("# assets base url", options.assets_base_url);
            log.info("# regular expressions", options.regular_expressions);
            log.info("# debug mode", options.debug);
            log.info("# development mode", options.development);
          }
          // in production mode there's Extract Text Loader which extracts CSS text away
          return module.source;
        }
      }
    }
  }
};
