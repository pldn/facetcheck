import { Term as SparqlTerm } from "helpers/SparqlJson";
export type FacetTypes = "multiselect" | "slider" | "nlProvinces" | "multiselectText";
import { FacetProps } from "reducers/facets";
import * as _ from "lodash";
export interface FacetConfig {
  iri: string;
  label: string;
  // datatype: string;
  facetType: FacetTypes;
  getFacetValuesQuery?: (iri: string) => string;
  facetValues?: FacetProps["optionList"] | FacetProps["optionObject"];
  facetToQueryPatterns: (values:FacetProps["optionList"] | FacetProps["optionObject"]) => string
  // getFacetFilter: () => {
  //
  // }
  // getBgp: (values: string[]) => string;
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
    facets: ["https://cultureelerfgoed.nl/vocab/province", "http://schema.org/dateCreated"],
    // widgets: ['leaflet', 'textarea'],
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
    facets: ["https://cultureelerfgoed.nl/vocab/province"],
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
  }
};

export var FACETS: { [property: string]: FacetConfig } = {
  "https://cultureelerfgoed.nl/vocab/province": {
    iri: "https://cultureelerfgoed.nl/vocab/province",
    label: "Provincie",
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
    facetToQueryPatterns: values => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <https://cultureelerfgoed.nl/vocab/province> <${v.value}> .`).join('} UNION {')
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
    facetToQueryPatterns: values => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <http://schema.org/dateCreated> ?createdAt .
        FILTER(strlen(?createdAt) = 4)
        FILTER(REGEX(?createdAt, '^\\\\d{4}$'))
        `;

        if (values.min) pattern += `FILTER(xsd:integer(?createdAt) >= ${values.min}) `;
        if (values.max) pattern += `FILTER(xsd:integer(?createdAt) <= ${values.max}) `;
        return pattern;
      }
    }
  }
};
