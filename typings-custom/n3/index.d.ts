declare module "n3" {
  import * as stream from 'stream'
  namespace n3 {
    interface Statement {
      subject:string,
      predicate:string,
      object:string,
      graph?: string
    }
    module Util {
      function isIRI(term:string):boolean;
      function isLiteral(term:string):boolean;
      function isBlank(term:string):boolean;
      function isPrefixedName(term:string):boolean;
      function expandPrefixedName(term:string, prefixes:{[prefixLabel:string]: string}):string;
      function getLiteralValue(term:string):string;
      function getLiteralLanguage(term:string):string;
      function getLiteralType(term:string):string;
      function createLiteral(value: string, datatype:string):string;
      function createLiteral(value: string, language:string):string;
      function createLiteral(value: string):string;
      function createLiteral(value: boolean):string;
      function createLiteral(value: number):string;
    }
    interface Options {
      format?: string,
      prefixes?: {[key:string]:string}
    }
    class Parser {
      parse(input:any, cb:(e:Error, result:Statement) => void):void
    }
    function StreamParser(opts?:Options) : stream.Duplex
    function StreamWriter(opts?:Options) : stream.Duplex
  }
  export = n3;
}
