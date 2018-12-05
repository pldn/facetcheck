

const REACT_APP = /^REACT_APP_/i;

export default function getClientEnvironment() {
  return Object.keys(process.env).filter(key => REACT_APP.test(key)).reduce((env, key) => {
    env["process.env." + key] = JSON.stringify(process.env[key]);
    return env;
  }, <{[varName:string]:string}> {
    // Useful for determining whether we’re running in production mode.
    // Most importantly, it switches React into the correct mode.
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
  });
}
