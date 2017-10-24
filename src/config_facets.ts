import {FacetConfig,toEntity} from 'facetConfUtils'


const FACETS: { [property: string]: FacetConfig } = {
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
export default FACETS;
