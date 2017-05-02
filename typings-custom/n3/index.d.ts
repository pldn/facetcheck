declare module "n3" {
  import * as stream from "stream"

  namespace n3 {
    export interface Statement {
      subject: string,
      predicate:string,
      object:string,
      graph?:string
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
    export class N3Parser {
      parse(inputString:string, cb:(error:Error,statement:Statement,prefixes:Object) => void):void
    }
    export function StreamParser(): stream.Duplex
    export interface WriteOptions {
      format?:'N-Quads' | 'N-Triples' | 'text/turtle',
      prefixes?:Object
    }
    export class StreamWriter extends stream.Duplex {
      constructor(options?:WriteOptions)
    }
    export function Parser(opts?: WriteOptions): N3Parser;
    export class N3Writer extends stream.Duplex {
      addTriple(subject:string, predicate:string, object:string, graph?:string):void;
      addTriple(statement:Statement):void;
    }
    export function Writer(stream?: any, options?:WriteOptions):N3Writer
    export function Writer(options?:WriteOptions):N3Writer

  }
  export = n3;
}
