
/**
 * Takes an array and removes undefined values
 * @param  {Array} array    what is being removed
 * @return {Array}          the "new" array with the items removed.
 */
export function removeEmpty<I>(array:I[]): Array<I> {
  return array.filter(entry => typeof entry !== "undefined");
}


export function ifElse(condition:boolean) {
  return function ifElse<T,E>(then:T, otherwise?:E){
    return condition ? then : otherwise;
  }
}
