import * as sparqlJs from 'sparqljs'
import {default as prefixes, getAsString, prefix} from 'prefixes'

export default class SparqlBuilder {
  private query:sparqlJs.Query = {
    prefixes: {},
    queryType: 'SELECT',
    variables: ['*'],
    limit: 10,
    where: []
  };
  private constructor(query?: sparqlJs.Query) {
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
  public vars(...vars: string[]) {
    this.query.variables = vars;
    return this;
  }

  public hasClasses(...classes:string[]) {
    return this.addUnions(classes.map<sparqlJs.QueryPattern>(c => {
      return {type: 'bgp',
      triples: [{
        subject: '?_r',
        predicate: prefix('rdf', 'type'),
        object: c
      }]
      }
    }))
  }
  public addQueryPatterns(patterns: sparqlJs.QueryPattern[]) {
    if (!patterns || patterns.length <= 0) return this;
    console.log('before', this.query)
    this.query.where = this.query.where.concat(patterns);
    console.log('after', this.query)
    return this;
  }
  public addUnions(patterns:sparqlJs.QueryPattern[]) {
    if (patterns && patterns.length) this.query.where.push({
      type: 'union',
      patterns: patterns

    })

    return this;
  }
  static fromQueryString(qString:string, _prefixes?:sparqlJs.Prefixes) {
    const parser = new sparqlJs.Parser({...prefixes, ..._prefixes}, 'https://triply.cc/base');
    return new SparqlBuilder(parser.parse(qString))
  }
  static getQueryPattern(bgpString:string, _prefixes?:sparqlJs.Prefixes) {
    bgpString = bgpString.trim();
    if (bgpString[0] !== '{') throw new Error(`Expected a BGP clause. Did you forget to enclose the BGP in parenthesis? ('{' and '}'). The string I received: ${bgpString}`)
    const parser = new sparqlJs.Parser({...prefixes, ..._prefixes}, 'https://triply.cc/base');
    const parsed = parser.parse(`SELECT * WHERE { ${bgpString} }`)
    return parsed.where[0]
  }
  static get(prefixes?:sparqlJs.Prefixes) {
    const builder = new SparqlBuilder();
    if (prefixes) builder.query.prefixes = prefixes;
    return builder
  }
}
