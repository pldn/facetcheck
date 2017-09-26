import { Term as SparqlTerm } from "helpers/SparqlJson";
export type FacetTypes = "multiselect" | "slider" | "nlProvinces" | "multiselectText";
export interface FacetConfig {
  iri: string;
  label: string;
  // datatype: string;
  facetType: FacetTypes;
  getFacetValues: (iri: string) => string;
  facetToQueryPatterns: (values: {values?: FacetValue[], minValue?: FacetValue, maxValue?:FacetValue}) => string[];
  // getFacetFilter: () => {
  //
  // }
  // getBgp: (values: string[]) => string;
}
export interface FacetValue extends Partial<SparqlTerm> {
  value: string;
  label?: string;

}
export interface ClassConfig {
  default: boolean;
  iri: string;
  label: string;
  facets: string[];
  resourceDescriptionQuery: (iri:string)=>string
}
export var CLASSES: { [className: string]: ClassConfig } = {
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true, //default
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: ["https://cultureelerfgoed.nl/vocab/province", "http://schema.org/dateCreated"],
    // widgets: ['leaflet', 'textarea'],
    resourceDescriptionQuery: function(iri:string) {
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
      return `CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `

    }
  },
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false, //default
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: ["https://cultureelerfgoed.nl/vocab/province"],
    resourceDescriptionQuery: function(iri:string) {
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
      return `CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `

    }
  }
};


export var FACETS: { [property: string]: FacetConfig } = {
  "https://cultureelerfgoed.nl/vocab/province": {
    iri: "https://cultureelerfgoed.nl/vocab/province",
    label: "Provincie",
    facetType: "nlProvinces",
    getFacetValues: (iri) => {
      return `
      SELECT DISTINCT ?_value ?_valueLabel WHERE {
        ?_r <${iri}> ?_value.
        ?_value a <http://www.gemeentegeschiedenis.nl/provincie>.
        OPTIONAL{
          ?_value rdfs:label ?_valueLabel .
          FILTER(datatype(?_valueLabel) = xsd:string)
        }
      } LIMIT 100`;
    },
    facetToQueryPatterns: values => {
      if (values.values instanceof Array) {
        return values.values.map(v => `?_r <https://cultureelerfgoed.nl/vocab/province> <${v.value}> .`)
      }
    }
  },
  "http://schema.org/dateCreated": {
    iri: "http://schema.org/dateCreated",
    label: "Bouwjaar",
    facetType: "slider",
    getFacetValues: (iri) => {
      return `
      SELECT DISTINCT (MIN(xsd:integer(?value)) as ?_minValue) (MAX(xsd:integer(?value)) as ?_maxValue) WHERE {
        ?_r <${iri}> ?value.
        FILTER(strlen(?value) = 4)
        FILTER(REGEX(?value, '^\\\\d{4}$'))

      } LIMIT 1`;
    },
    facetToQueryPatterns: values => {
      if (values.minValue || values.minValue) {
        var pattern = `?_r <http://schema.org/dateCreated> ?createdAt . `
        if (values.minValue) pattern += `FILTER(xsd:integer(?createdAt) >= ${values.minValue}) `
        if (values.maxValue) pattern += `FILTER(xsd:integer(?createdAt) <= ${values.maxValue}) `
        return [pattern];
      }
    }
  },
};
