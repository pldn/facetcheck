import * as _ from 'lodash'
export interface Term {
  type: 'uri' | 'literal' | 'bnode',
  value: string,
  'xml:lang': string,
  datatype: string
}
export type Binding = {[varName:string]: Term}
export interface Sparql {
  head: {
    vars: string[]
  }
  results:{
    bindings: Binding[]
  }
}

export default class SparqlJson {
  sparqlJson: Sparql
  constructor(sparqlJson:Sparql) {
    if (!sparqlJson || !sparqlJson.head || !sparqlJson.results) {
      throw new Error('expected sparql json..')
    }
    this.sparqlJson = sparqlJson;
  }
  getValuesForVar(varname:string):string[] {
    if (this.sparqlJson.head.vars.indexOf(varname) < 0) return [];
    return (this.sparqlJson.results.bindings.map((binding) => {
      return binding[varname].value
    }))
  }
  getValuesAndDtypeForVar(varname:string):{value: string, datatype?:string}[] {
    if (this.sparqlJson.head.vars.indexOf(varname) < 0) return [];
    return (this.sparqlJson.results.bindings.map((binding) => {
      var obj:{value: string, datatype?:string} = {
        value: binding[varname].value
      };
      if (binding[varname].datatype) obj.datatype = binding[varname].datatype
      return obj;
    }))
  }
  getValuesForVars(...varnames:string[]):string[][] {
    for (var i = 0; i < varnames.length; i++) {
      if (this.sparqlJson.head.vars.indexOf(varnames[i]) < 0) return [];
    }
    return (this.sparqlJson.results.bindings.map((binding) => {
      var values:string[] = [];
      varnames.forEach(varname => {
        if (binding[varname] && binding[varname].value) {
          values.push(binding[varname].value)
        } else {
          values.push(undefined)
        }
      })
      return values;
    }))
  }

}
