declare module "sparqljs" {
  import * as stream from "stream";

  namespace n3 {
    export interface Triple {
      subject: string;
      predicate: string;
      object: string;
    }
    export interface Prefixes {
      [key:string]: string
    }
    export interface ParserOptions {
      collapseGroups?: boolean
    }
    export class Parser {
      constructor(prefixes?:Prefixes,  baseIRI?: string, options?:ParserOptions )
      parse(queryString:string): Query;
    }
    export interface QueryPattern {
      type: "bgp" | "group" | "union" | "filter" | "optional",

      triples?: Triple[],
      patterns?: QueryPattern[]
    }
    export interface QueryGroup {
      expression?:QueryExpression
    }
    export type QueryExpression = string | {
      expression: QueryExpression,
      type?: 'aggregate',
      aggregation?: 'group_concat',
      separator?: string,
      distinct?:boolean
    }
    export interface Query {
      reduced?: boolean,
      distinct?: boolean,
      prefixes?: Prefixes,
      group?: QueryGroup[]
      limit?:number
      queryType: "SELECT" | "CONSTRUCT" | "DESCRIBE" | "ASK",
      variables: string[],
      where: QueryPattern[]
    }

    export interface GeneratorOptions {
      allPrefixes?: boolean
    }
    export class Generator {
      constructor(options?: GeneratorOptions, prefixes?:Prefixes);
      stringify(q:Query):string
    }
  }
  export = n3;
}
