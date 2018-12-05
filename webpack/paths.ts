import * as path from "path";
import * as fs from "fs";
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
}

export const base = appDirectory;
export const build = resolveApp("build");
export const assets = resolveApp("build/assets/dist");
export const assetsProd = resolveApp("build/assets/dist");
export const appIndexTs = resolveApp("src/client.tsx");
export const src = resolveApp("src");
export const nodeModules = resolveApp("node_modules");
