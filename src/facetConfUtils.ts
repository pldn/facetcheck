import { Term as SparqlTerm } from "helpers/SparqlJson";
export type FacetTypes = "multiselect" | "slider" | "nlProvinces" | "multiselectText";
import { FacetProps } from "reducers/facets";
export interface FacetConfig {
  iri: string;
  label?: string;
  // datatype: string;
  facetType: FacetTypes;
  getFacetValuesQuery?: (iri: string) => string;
  facetValues?: FacetProps["optionList"] | FacetProps["optionObject"];
  facetToQueryPatterns: (iri:string, values:FacetProps["optionList"] | FacetProps["optionObject"]) => string
}
export interface FacetValue extends Partial<SparqlTerm> {
  value:string,
  label?: string;
}
export interface ClassConfig {
  default: boolean;
  iri: string;
  label: string;
  facets: string[];
  resourceDescriptionQuery: (iri: string) => string;
}
const escape = /["\\\t\n\r\b\f]/g;
const escapeReplacer = function (c:string) { return escapeReplacements[c]; };
const escapeReplacements:{[key:string]:string} = { '\\': '\\\\', '"': '\\"', '\t': '\\t',
                           '\n': '\\n', '\r': '\\r', '\b': '\\b', '\f': '\\f' };
var XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';
export function toEntity(value:FacetValue):string {
  // regular entity
  if (value.type === 'bnode') {
    return value.value;
  }
  if (value.type === 'uri') {
    return `<${value.value}>`
  }
  //its a literal
  if (value.datatype === XSD_INTEGER && /^\d+$/.test(value.value)) {
    // Add space to avoid confusion with decimals in broken parsers
    return value.value + ' ';
  }

  var stringRepresentation = `"${value.value.replace(escape, escapeReplacer)}"`
  if (value.type === 'typed-literal') {
    stringRepresentation += `^^<${value.datatype}>`
  }
  return stringRepresentation
}