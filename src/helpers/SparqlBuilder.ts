import * as sparqlJs from 'sparqljs'
import { getAsString, prefix} from '../prefixes'
import {getPrefixes} from '../facetConf'
export type Prefixes = { [prefix: string]: string; }
export default class SparqlBuilder {

  private query:sparqlJs.SelectQuery = {
    type: 'query',
    queryType: 'SELECT',
    prefixes: {},
    variables: ['*'],
    limit: 10,
    where: []
  };
  private constructor(query?: sparqlJs.SelectQuery) {
    if (query) this.query = query;
  }


  public toString() {
    const g =  new sparqlJs.Generator({allPrefixes: true})
    return g.stringify(this.query);
  }

  public distinct(distinct = true) {
    this.query.distinct = distinct;
    return this;
  }
  public limit(limit:number) {
    this.query.limit = limit;
    return this;
  }
  public offset(offset:number) {
    this.query.offset = offset;
    return this;
  }

  /**
  * From  @types/sparqljs doc:
   * Either '?var', 'schema:iri', '_:blankNode',
   * '"literal"^^<schema:datatype>' or '{undefined}'.
   *
   * Term is a nominal type based on string.
   * export type Term = string & { __termBrand: string; };
   */

  private stringAsTerm(termString:string):sparqlJs.Term {
    return termString as any//just replace typing for now. If this trick causes issues, we could assign the __termBrand property
  }
  public vars(...vars: string[]) {
    this.query.variables = vars.map(v => this.stringAsTerm(v)) ;
    return this;
  }

  public hasClasses(...classes:string[]) {
    return this.addUnions(classes.map<sparqlJs.BgpPattern>(c => {
      return {type: 'bgp',
      triples: [{
        subject: this.stringAsTerm('?_r'),
        predicate: this.stringAsTerm(prefix({rdf:'http://www.w3.org/1999/02/22-rdf-syntax-ns#', ...getPrefixes()},'rdf', 'type')),
        object: this.stringAsTerm(c)
      }]
      }
    }))
  }
  public addQueryPatterns(patterns: sparqlJs.Pattern[]) {
    if (!patterns || patterns.length <= 0) return this;
    this.query.where = this.query.where.concat(patterns);
    return this;
  }
  public addUnions(patterns:sparqlJs.Pattern[]) {
    if (patterns && patterns.length) this.query.where.push({
      type: 'union',
      patterns: patterns

    })

    return this;
  }
  static fromQueryString(qString:string, _prefixes?:Prefixes) {
    const parser = new sparqlJs.Parser({...getPrefixes(), ..._prefixes});
    const parsed = parser.parse(qString);
    if (parsed.type === "query" && parsed.queryType === "SELECT") {

      return new SparqlBuilder(parsed)
    } else {
      throw new Error('Expected a select query')
    }
  }
  static getQueryPattern(bgpString:string, _prefixes?:Prefixes) {
    bgpString = bgpString.trim();
    if (bgpString[0] !== '{') throw new Error(`Expected a BGP clause. Did you forget to enclose the BGP in parenthesis? ('{' and '}'). The string I received: ${bgpString}`)
    const parser = new sparqlJs.Parser({...getPrefixes(), ..._prefixes});
    const parsed = parser.parse(`SELECT * WHERE { ${bgpString} }`) as sparqlJs.SelectQuery
    return parsed.where[0].patterns
  }
  static get(prefixes?:Prefixes) {
    const builder = new SparqlBuilder();
    if (prefixes) builder.query.prefixes = prefixes;
    return builder
  }
}
