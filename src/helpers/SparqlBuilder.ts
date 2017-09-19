import * as sparqlJs from 'sparqljs'


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

  public distinct() {
    this.query.distinct = true;
    return this;
  }
  public limit(limit:number) {
    this.query.limit = limit;
  }
  public vars(...vars: string[]) {
    this.query.variables = vars;
    return this;
  }
  public addUnions(patterns:sparqlJs.QueryPattern[]) {
    if (patterns && patterns.length) this.query.where.push({
      type: 'union',
      patterns: patterns

    })

    return this;
  }
  static fromQueryString(qString:string, prefixes?:sparqlJs.Prefixes) {
    const parser = new sparqlJs.Parser(prefixes, 'https://triply.cc/base');
    return new SparqlBuilder(parser.parse(qString))
  }
  static get(prefixes?:sparqlJs.Prefixes) {
    const builder = new SparqlBuilder();
    if (prefixes) builder.query.prefixes = prefixes;
    return builder
  }
}
