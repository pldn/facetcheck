import {SparqlTerm as Term} from '../facetConfUtils'
export type Binding = { [varName: string]: Term };
export interface Sparql {
  head: {
    vars: string[];
  };
  results: {
    bindings: Binding[];
  };
}
import {isEmpty} from 'lodash'

export default class SparqlJson {
  sparqlJson: Sparql;
  constructor(sparqlJson: Sparql) {
    if (!sparqlJson || !sparqlJson.head || !sparqlJson.results) {
      throw new Error("expected sparql json..");
    }
    this.sparqlJson = sparqlJson;
  }
  getValuesForVar(varname: string): string[] {
    if (this.sparqlJson.head.vars.indexOf(varname) < 0) return [];
    return this.sparqlJson.results.bindings.map(binding => {
      if (!binding || !binding[varname]) return undefined;
      return binding[varname].value;
    }).filter(val => !!val);
  }
  getValuesAndDtypeForVar(varname: string): { value: string; datatype?: string }[] {
    if (this.sparqlJson.head.vars.indexOf(varname) < 0) return [];
    return this.sparqlJson.results.bindings.map(binding => {
      var obj: { value: string; datatype?: string } = {
        value: binding[varname].value
      };
      if (binding[varname].datatype) obj.datatype = binding[varname].datatype;
      return obj;
    });
  }
  getValues() {
    return this.sparqlJson.results.bindings;
  }
  hasResult():boolean {
    if (!this.sparqlJson) return false;
    if (!this.sparqlJson.results) return false;
    if (!this.sparqlJson.results.bindings) return false;
    if (this.sparqlJson.results.bindings.length === 1 && isEmpty(this.sparqlJson.results.bindings[0]) ) return false;
    return true;
  }
  getValuesForVars(...varnames: string[]): string[][] {
    return this.sparqlJson.results.bindings.map(binding => {
      var values: string[] = [];
      varnames.forEach(varname => {
        if (binding[varname] && binding[varname].value) {
          values.push(binding[varname].value);
        } else {
          values.push(undefined);
        }
      });
      return values;
    });
  }
}
