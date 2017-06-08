declare module '*.scss' {
  const content:{[ key: string ]: any} | any; //use any as well, otherwise we can't use the dot notation
  export = content;
}
