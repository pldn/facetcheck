/**
 * Lets try and keep the number of includes here to a bare minimum. That makes our live easier in the facetCheckConfig repo,
 * because otherwise we'd get lots of missing typescript defs for some dependencies (that are used in facetcheck, not facetcheckConfig)
 */

export interface  SparqlTerm {
  type: "uri" | "literal" | "bnode" | "typed-literal";
  value: string;
  "xml:lang": string;
  datatype: string;
}

export type FacetTypes = "multiselect" | "slider" | "nlProvinces" | "multiselectText";


export type FacetOptionsObject = { [key: string]: FacetValue | number };
export type FacetOptionsList = FacetValue[];
export interface FacetOptionsNlProvinces {
  drenthe: FacetValue;
  flevoland: FacetValue;
  friesland: FacetValue;
  gelderland: FacetValue;
  limburg: FacetValue;
  "n-brabant": FacetValue;
  "n-holland": FacetValue;
  overijssel: FacetValue;
  zeeland: FacetValue;
  "z-holland": FacetValue;
  utrecht: FacetValue;
  groningen: FacetValue;
}

export type FacetToQueryPatterns<V> = (iri:string, values:V) => string
export interface FacetConfigBase {

  label?: string;
  getFacetValuesQuery?: (iri: string) => string;
}

export interface FacetConfigMultiselect extends FacetConfigBase{
  facetType: 'multiselect',
  facetValues?:FacetOptionsList,
  facetToQueryPatterns: FacetToQueryPatterns<FacetOptionsList>
}
export interface FacetConfigNlProvinces extends FacetConfigBase{
  facetType: 'nlProvinces',
  facetValues?:FacetOptionsNlProvinces,
  facetToQueryPatterns: FacetToQueryPatterns<FacetOptionsNlProvinces>
}
export interface FacetConfigSlider extends FacetConfigBase{
  facetType: 'slider',
  facetValues?:FacetOptionsObject
  facetToQueryPatterns: FacetToQueryPatterns<FacetOptionsObject>
}
export type FacetConfig = FacetConfigMultiselect | FacetConfigNlProvinces | FacetConfigSlider
export interface FacetValue extends Partial<SparqlTerm> {
  value:string,
  label?: string;
}
export interface GlobalConfig {
  endpoint: {
    url:string,
    token?:string
  },
  prefixes: {[label:string]:string}
  pageSize?: number
  title?:string
  logo?:string
  favIcon?:string
  defaultClass?:string
  getDereferenceableLink?:(link:string) => string
  geoMap?: 'nlmaps' | 'osm'
}
export interface ClassConfig {
  iri: string;
  label: string;
  facets: string[];
  resourceDescriptionQuery: (iri: string) => string;
  //todo: make key use WidgetIdentifier from TermLiteral (need new ts version for this)
  widgetConfigs?:{[key:string]: {}}
  classToQueryPattern?: (iri:string) => string
}
const escape = /["\\\t\n\r\b\f]/g;
const escapeReplacer = function (c:string) { return escapeReplacements[c]; };
const escapeReplacements:{[key:string]:string} = { '\\': '\\\\', '"': '\\"', '\t': '\\t',
                           '\n': '\\n', '\r': '\\r', '\b': '\\b', '\f': '\\f' };
var XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';
export function toEntity(value:any):string {
  if (!value || !value.value) return value;//probably just a plain string or number
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
