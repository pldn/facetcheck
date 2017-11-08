import {FacetConfig,toEntity} from 'facetConfUtils'

const FACETS: { [property: string]: FacetConfig } = {
  // cbs:afstandCafé
  "https://data.pdok.nl/cbs/vocab/afstandCafé": {
    iri: "https://data.pdok.nl/cbs/vocab/afstandCafé",
    facetType: "slider",
    label: "Afstand tot café (km)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?afstand . bind (xsd:float(?afstand) as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(xsd:float(?count) >= ${values.min}) `;
        if (values.max) pattern += `filter(xsd:float(?count) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:attractieAfstand
  "https://data.pdok.nl/cbs/vocab/attractieAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/attractieAfstand",
    facetType: "slider",
    label: "Afstand tot attractie (km)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?afstand . bind (xsd:float(?afstand) as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(xsd:float(?count) >= ${values.min}) `;
        if (values.max) pattern += `filter(xsd:float(?count) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenA
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
    facetType: "slider",
    label: "Bedrijven (landbouw/bosbouw/visserij)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenBF
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
    facetType: "slider",
    label: "Bedrijven (nijverheid/energie)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenGI
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
    facetType: "slider",
    label: "Bedrijven (handel/horeca)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenHJ
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
    facetType: "slider",
    label: "Bedrijven (vervoer/informatie/communicatie)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenKL
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
    facetType: "slider",
    label: "Bedrijven (financiën/onroerend goed)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenMN
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
    facetType: "slider",
    label: "Bedrijven (zakelijke dienstverlening)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenRU
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
    facetType: "slider",
    label: "Bedrijven (cultuur/recreatie)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter(?count >= ${values.min}) `;
        if (values.max) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  /*
  // cbs:huisartsenpraktijkAfstand
  "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?value .`;
        if (values.min) pattern += `filter(xsd:float(?value) >= ${values.min})` ;
        if (values.max) pattern += `filter(xsd:float(?value) <= ${values.max})`;
        return pattern;
      }
    }
  },
  */
  // cbs:inwoners
  "https://data.pdok.nl/cbs/vocab/inwoners": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter (?count >= ${values.min}) `;
        if (values.max) pattern += `filter (?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautos6+
  "https://data.pdok.nl/cbs/vocab/personenautos6+": {
    iri: "https://data.pdok.nl/cbs/vocab/personenautos6+",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      } limit 1`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter (?count >= ${values.min}) `;
        if (values.max) pattern += `filter (?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:stedelijkheid
  "https://data.pdok.nl/cbs/vocab/stedelijkheid": {
    iri: "https://data.pdok.nl/cbs/vocab/stedelijkheid",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select distinct ?_value ?_valueLabel {
        ?_r <${iri}> ?_value .
        ?_value rdfs:label ?_valueLabel .
      }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} .`).join('} union {')
      }
    }
  },
  // cbs:woz
  "https://data.pdok.nl/cbs/vocab/woz": {
    iri: "https://data.pdok.nl/cbs/vocab/woz",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count .`;
        if (values.min) pattern += `filter (?count >= ${values.min}) `;
        if (values.max) pattern += `filter (?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // rce:bouwjaar
  "https://cultureelerfgoed.nl/vocab/bouwjaar": {
    iri: "https://cultureelerfgoed.nl/vocab/bouwjaar",
    facetType: "slider",
    getFacetValuesQuery: iri => {
      return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?year .`;
        if (values.min) pattern += `filter (year(xsd:dateTime(?year)) >= ${values.min}) `;
        if (values.max) pattern += `filter (year(xsd:dateTime(?year)) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // rce:monumentCode
  "https://cultureelerfgoed.nl/vocab/monumentCode": {
    iri: "https://cultureelerfgoed.nl/vocab/monumentCode",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select distinct ?_value ?_valueLabel {
        ?_r <${iri}> ?_value
        optional { ?_value rdfs:label ?_valueLabel }
      }
      order by asc(?_valueLabel)
      limit 100`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r <${iri}> ${toEntity(v)} .`).join('} union {')
      }
    }
  },
  // rce:provincie
  "https://cultureelerfgoed.nl/vocab/provincie": {
    iri: "https://cultureelerfgoed.nl/vocab/provincie",
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
      friesland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Friesland",
        label: "Friesland"
      },
      gelderland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Gelderland",
        label: "Gelderland"
      },
      limburg: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Limburg",
        label: "Limburg"
      },
      "n-brabant": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Noord-Brabant",
        label: "Noord-Brabant"
      },
      "n-holland": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Noord-Holland",
        label: "Noord-Holland"
      },
      overijssel: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Overijssel",
        label: "Overijssel"
      },
      zeeland: {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Zeeland",
        label: "Zeeland"
      },
      "z-holland": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Zuid-Holland",
        label: "Zuid-holland"
      },
      "utrecht": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Utrecht",
        label: "Utrecht"
      },
      "groningen": {
        value: "http://www.gemeentegeschiedenis.nl/provincie/Groningen",
        label: "Groningen"
      },
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r geo:sfWithin* <${v.value}> .`).join('} union {')
      }
    }
  }
};
export default FACETS;
