var path = require("path");
var fs = require("fs");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// config after eject: we're in ./config/
module.exports = {
  base: appDirectory,
  build: resolveApp("build"),
  assets: resolveApp("build/assets/dist"),
  assetsProd: resolveApp("build/assets/dist"),
  appIndexTs: resolveApp("src/client.tsx"),
  src: resolveApp("src"),
  nodeModules: resolveApp("node_modules")
};
