import { Term as SparqlTerm } from "helpers/SparqlJson";
export type FacetTypes = "multiselect" | "slider" | "nlProvinces" | "multiselectText";
import { FacetProps } from "reducers/facets";
import * as _ from "lodash";
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
export var CLASSES: { [className: string]: ClassConfig } = {
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true, //default
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: ["https://cultureelerfgoed.nl/vocab/province", "http://schema.org/dateCreated", "http://dbpedia.org/ontology/code"],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?x ?y.
        <${iri}> brt:lijnGeometrie ?brtGeo .
        ?brtGeo geo:asWKT ?wkt.
        <${iri}> geo:hasGeometry ?geo .
        ?geo geo:asWKT ?wkt.
        ?y rdfs:label ?yLabel .

      `;
      var selectPattern = `
      <${iri}> ?x ?y.
      OPTIONAL {
        ?y rdfs:label ?yLabel
      }
      OPTIONAL {
        ?x rdfs:label ?xLabel
      }

      OPTIONAL {
        <${iri}> geo:hasGeometry ?geo .
        ?geo geo:asWKT ?wkt.
      }

      `;
      return `CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `;
    }
  },
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false, //default
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: [
      // "https://cultureelerfgoed.nl/vocab/province",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand",
      "https://data.pdok.nl/cbs/vocab/woz",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/personenautos6+"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?x ?y.
        <${iri}> brt:lijnGeometrie ?brtGeo .
        ?brtGeo geo:asWKT ?wkt.
        <${iri}> geo:hasGeometry ?geo .
        ?geo geo:asWKT ?wkt.
        ?y rdfs:label ?yLabel .

      `;
      var selectPattern = `
      GRAPH <https://data.pdok.nl/cbs/id/graph/2015> {
          <${iri}> ?x ?y.
          OPTIONAL {
            ?y rdfs:label ?yLabel
          }
          OPTIONAL {
            ?x rdfs:label ?xLabel
          }

          OPTIONAL {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt.
          }
        }

      `;
      return `CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `;
    }
  }
};
const escape = /["\\\t\n\r\b\f]/g;
const escapeReplacer = function (c:string) { return escapeReplacements[c]; };
const escapeReplacements:{[key:string]:string} = { '\\': '\\\\', '"': '\\"', '\t': '\\t',
                           '\n': '\\n', '\r': '\\r', '\b': '\\b', '\f': '\\f' };
var XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';
function toEntity(value:FacetValue):string {
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
export var FACETS: { [property: string]: FacetConfig } = {
  "http://dbpedia.org/ontology/code": {
    iri: "http://dbpedia.org/ontology/code",
    label: "Monument code",
    facetType: "multiselect",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT ?_value ?_valueLabel WHERE {
        ?_r <${iri}> ?_value.
        OPTIONAL {
          ?_value rdfs:label ?_valueLabel
        }
      } LIMIT 100`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} .`).join('} UNION {')
      }
    }
  },
  "https://cultureelerfgoed.nl/vocab/province": {
    iri: "https://cultureelerfgoed.nl/vocab/province",
    // label: "Provincie",
    facetType: "nlProvinces",
    facetValues: {
      drenthe: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Drenthe",
        label: "Drenthe"
      },
      flevoland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Flevoland",
        label: "Flevoland"
      },

      friesland: { value: "http://www.gemeentegeschiedenis.nl/provincie/Friesland", label: "Friesland" },
      gelderland: { value: "http://www.gemeentegeschiedenis.nl/provincie/Gelderland", label: "Gelderland`" },
      limburg: { value: "http://www.gemeentegeschiedenis.nl/provincie/Limburg", label: "Limburg" },
      "n-brabant": { value: "http://www.gemeentegeschiedenis.nl/provincie/Noord-Brabant", label: "Noord-Brabant" },
      "n-holland": { value: "http://www.gemeentegeschiedenis.nl/provincie/Noord-Holland", label: "Noord-Hollandd" },
      overijssel: { value: "http://www.gemeentegeschiedenis.nl/provincie/Overijssel", label: "Overijssel" },
      zeeland: { value: "http://www.gemeentegeschiedenis.nl/provincie/Zeeland", label: "Zeeland" },
      "z-holland": { value: "http://www.gemeentegeschiedenis.nl/provincie/Zuid-Holland", label: "Zuid-holland" },
      "utrecht": { value: "http://www.gemeentegeschiedenis.nl/provincie/Utrecht", label: "Utrecht" },
      "groningen": { value: "http://www.gemeentegeschiedenis.nl/provincie/Groningen", label: "Groningen" },
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> <${v.value}> .`).join('} UNION {')
      }
    }
  },
  "http://schema.org/dateCreated": {
    iri: "http://schema.org/dateCreated",
    label: "Bouwjaar",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT (MIN(xsd:integer(?value)) as ?_min) (MAX(xsd:integer(?value)) as ?_max) WHERE {
        ?_r <${iri}> ?value.
        FILTER(strlen(?value) = 4)
        FILTER(REGEX(?value, '^\\\\d{4}$'))

      } LIMIT 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?createdAt .
        FILTER(strlen(?createdAt) = 4)
        FILTER(REGEX(?createdAt, '^\\\\d{4}$'))
        `;

        if (values.min) pattern += `FILTER(xsd:integer(?createdAt) >= ${values.min}) `;
        if (values.max) pattern += `FILTER(xsd:integer(?createdAt) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand",
    label: "Afstand tot huisartsenpraktijk",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT (MIN(xsd:float(?value)) as ?_min) (MAX(xsd:float(?value)) as ?_max) WHERE {
        ?_r <${iri}> ?value.
      } LIMIT 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?value .
        `;

        if (values.min) pattern += `FILTER(xsd:float(?value) >= ${values.min}) `;
        if (values.max) pattern += `FILTER(xsd:float(?value) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
    label: "bedrijfsvestigingen",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT (MIN(?value) as ?_min) (MAX(?value) as ?_max) WHERE {
        GRAPH <https://data.pdok.nl/cbs/id/graph/2015>  {
          ?_r <${iri}> ?value.
        }
      } LIMIT 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;

        if (values.min) pattern += `FILTER(?count >= ${values.min}) `;
        if (values.max) pattern += `FILTER(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "https://data.pdok.nl/cbs/vocab/woz": {
    iri: "https://data.pdok.nl/cbs/vocab/woz",
    label: "WOZ waarde",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT (MIN(?value) as ?_min) (MAX(?value) as ?_max) WHERE {
        GRAPH <https://data.pdok.nl/cbs/id/graph/2015>  {
          ?_r <${iri}> ?value.
        }
      } LIMIT 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;

        if (values.min) pattern += `FILTER(?count >= ${values.min}) `;
        if (values.max) pattern += `FILTER(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "https://data.pdok.nl/cbs/vocab/inwoners": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners",
    label: "Aantal inwoners",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT (MIN(?value) as ?_min) (MAX(?value) as ?_max) WHERE {
        GRAPH <https://data.pdok.nl/cbs/id/graph/2015>  {
          ?_r <${iri}> ?value.
        }
      } LIMIT 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;

        if (values.min) pattern += `FILTER(?count >= ${values.min}) `;
        if (values.max) pattern += `FILTER(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "https://data.pdok.nl/cbs/vocab/personenautos6+": {
    iri: "https://data.pdok.nl/cbs/vocab/personenautos6+",
    label: "Personenauto's ouder dan 6 jaar",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT (MIN(?value) as ?_min) (MAX(?value) as ?_max) WHERE {
        GRAPH <https://data.pdok.nl/cbs/id/graph/2015>  {
          ?_r <${iri}> ?value.
        }
      } LIMIT 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;

        if (values.min) pattern += `FILTER(?count >= ${values.min}) `;
        if (values.max) pattern += `FILTER(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  "https://data.pdok.nl/cbs/vocab/stedelijkheid": {
    iri: "https://data.pdok.nl/cbs/vocab/stedelijkheid",
    label: "Stedelijkheid",
    facetType: "multiselect",
    getFacetValuesQuery: iri => {
      return `
      SELECT DISTINCT ?_value ?_valueLabel WHERE {
        GRAPH <https://data.pdok.nl/cbs/id/graph/2015>  {
          ?_r <${iri}> ?_value.
        }
        OPTIONAL {
          ?_value rdfs:label ?_valueLabel
        }
      } LIMIT 100`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} .`).join('} UNION {')
      }
    }
  }
};
