import {ClassProps,FacetProps} from 'reducers/facets'

export var CLASSES: { [className: string]: ClassProps } = {
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true, //default
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: ["https://cultureelerfgoed.nl/vocab/province", "http://schema.org/dateCreated"]
  },
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false, //default
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: ["https://cultureelerfgoed.nl/vocab/province"]
  }
};


export var FACETS: { [property: string]: FacetProps } = {
  "https://cultureelerfgoed.nl/vocab/province": {
    iri: "https://cultureelerfgoed.nl/vocab/province",
    label: "Provincie",
    facetType: "multiselect",
    getFacetValues: (iri, state) => {
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
    getFacetValues: (iri, state) => {
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
