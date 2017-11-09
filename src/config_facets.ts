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
        var pattern = `?_r <${iri}> ?count10 .`;
        if (values.min) pattern += `filter(xsd:float(?count10) >= ${values.min}) `;
        if (values.max) pattern += `filter(xsd:float(?count10) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:antillianen
  "https://data.pdok.nl/cbs/vocab/antillianen": {
    iri: "https://data.pdok.nl/cbs/vocab/antillianen",
    facetType: "slider",
    label: "Aantal antillianen",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?afstand . bind("1" as ?bla) bind (xsd:float(?afstand) as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count11 .`;
        if (values.min) pattern += `filter(xsd:float(?count11) >= ${values.min}) `;
        if (values.max) pattern += `filter(xsd:float(?count11) <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count20 .`;
        if (values.min) pattern += `filter(xsd:float(?count20) >= ${values.min}) `;
        if (values.max) pattern += `filter(xsd:float(?count20) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingen
  "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
    facetType: "slider",
    label: "Bedrijven",
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
        var pattern = `?_r <${iri}> ?count29 .`;
        if (values.min) pattern += `filter(?count29 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count29 <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count30 .`;
        if (values.min) pattern += `filter(?count30 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count30 <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count40 .`;
        if (values.min) pattern += `filter(?count40 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count40 <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count50 .`;
        if (values.min) pattern += `filter(?count50 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count50 <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count60 .`;
        if (values.min) pattern += `filter(?count60 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count60 <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count70 .`;
        if (values.min) pattern += `filter(?count70 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count70 <= ${values.max}) `;
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
        var pattern = `?_r <${iri}> ?count80 .`;
        if (values.min) pattern += `filter(?count80 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count80 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsmotorvoertuigen
  "https://data.pdok.nl/cbs/vocab/bedrijfsmotorvoertuigen": {
    iri: "https://data.pdok.nl/cbs/vocab/bedrijfsmotorvoertuigen",
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
        var pattern = `?_r <${iri}> ?count81 .`;
        if (values.min) pattern += `filter (?count81 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count81 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bevolkingsdichtheid
  "https://data.pdok.nl/cbs/vocab/bevolkingsdichtheid": {
    iri: "https://data.pdok.nl/cbs/vocab/bevolkingsdichtheid",
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
        var pattern = `?_r <${iri}> ?count82 .`;
        if (values.min) pattern += `filter (?count82 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count82 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bibliotheek
  "https://data.pdok.nl/cbs/vocab/bibliotheek": {
    iri: "https://data.pdok.nl/cbs/vocab/bibliotheek",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count83 .`;
        if (values.min) pattern += `filter (xsd:float(?count83) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count83) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bioscoopAfstand
  "https://data.pdok.nl/cbs/vocab/bioscoopAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/bioscoopAfstand",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count84 .`;
        if (values.min) pattern += `filter (xsd:float(?count84) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count84) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bouwklasse-1999
  "https://data.pdok.nl/cbs/vocab/bouwklasse-1999": {
    iri: "https://data.pdok.nl/cbs/vocab/bouwklasse-1999",
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
        var pattern = `?_r <${iri}> ?count85 .`;
        if (values.min) pattern += `filter (?count85 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count85 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bouwklasse2000+
  "https://data.pdok.nl/cbs/vocab/bouwklasse2000+": {
    iri: "https://data.pdok.nl/cbs/vocab/bouwklasse2000+",
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
        var pattern = `?_r <${iri}> ?count86 .`;
        if (values.min) pattern += `filter (?count86 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count86 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:brandweer
  "https://data.pdok.nl/cbs/vocab/brandweer": {
    iri: "https://data.pdok.nl/cbs/vocab/brandweer",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count87 .`;
        if (values.min) pattern += `filter (xsd:float(?count87) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count87) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:buitenpolikliniekAfstand
  "https://data.pdok.nl/cbs/vocab/buitenpolikliniekAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/buitenpolikliniekAfstand",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count88 .`;
        if (values.min) pattern += `filter (xsd:float(?count88) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count88) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:buitenschoolseopvangAfstand
  "https://data.pdok.nl/cbs/vocab/buitenschoolseopvangAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/buitenschoolseopvangAfstand",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count89 .`;
        if (values.min) pattern += `filter (xsd:float(?count89) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count89) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:cafetariumAfstand
  "https://data.pdok.nl/cbs/vocab/cafetariumAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/cafetariumAfstand",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count891 .`;
        if (values.min) pattern += `filter (xsd:float(?count891) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count891) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:geboortePercentage
  "https://data.pdok.nl/cbs/vocab/geboortePercentage": {
    iri: "https://data.pdok.nl/cbs/vocab/geboortePercentage",
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
        var pattern = `?_r <${iri}> ?count893 .`;
        if (values.min) pattern += `filter (?count893 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count893 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:gehuwd
  "https://data.pdok.nl/cbs/vocab/gehuwd": {
    iri: "https://data.pdok.nl/cbs/vocab/gehuwd",
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
        var pattern = `?_r <${iri}> ?count90 .`;
        if (values.min) pattern += `filter (?count90 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count90 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:gescheiden
  "https://data.pdok.nl/cbs/vocab/gescheiden": {
    iri: "https://data.pdok.nl/cbs/vocab/gescheiden",
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
        var pattern = `?_r <${iri}> ?count100 .`;
        if (values.min) pattern += `filter (?count100 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count100 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:hotelAfstand
  "https://data.pdok.nl/cbs/vocab/hotelAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/hotelAfstand",
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
        var pattern = `?_r <${iri}> ?value100 .`;
        if (values.min) pattern += `filter(xsd:float(?value100) >= ${values.min})` ;
        if (values.max) pattern += `filter(xsd:float(?value100) <= ${values.max})`;
        return pattern;
      }
    }
  },
  // cbs:huishoudenGrootte
  "https://data.pdok.nl/cbs/vocab/huishoudenGrootte": {
    iri: "https://data.pdok.nl/cbs/vocab/huishoudenGrootte",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count110 .`;
        if (values.min) pattern += `filter (xsd:float(?count110) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count110) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:huishoudens
  "https://data.pdok.nl/cbs/vocab/huishoudens": {
    iri: "https://data.pdok.nl/cbs/vocab/huishoudens",
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
        var pattern = `?_r <${iri}> ?count120 .`;
        if (values.min) pattern += `filter (?count120 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count120 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:huishoudensMetKinderen
  "https://data.pdok.nl/cbs/vocab/huishoudensMetKinderen": {
    iri: "https://data.pdok.nl/cbs/vocab/huishoudensMetKinderen",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count130 .`;
        if (values.min) pattern += `filter (xsd:float(?count130) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count130) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:huishoudensZonderKinderen
  "https://data.pdok.nl/cbs/vocab/huishoudensZonderKinderen": {
    iri: "https://data.pdok.nl/cbs/vocab/huishoudensZonderKinderen",
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
        var pattern = `?_r <${iri}> ?count140 .`;
        if (values.min) pattern += `filter (?count140 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count140 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:ijsbaan
  "https://data.pdok.nl/cbs/vocab/ijsbaan": {
    iri: "https://data.pdok.nl/cbs/vocab/ijsbaan",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count150 .`;
        if (values.min) pattern += `filter (xsd:float(?count150) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count150) <= ${values.max}) `;
        return pattern;
      }
    }
  },
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
        var pattern = `?_r <${iri}> ?count160 .`;
        if (values.min) pattern += `filter (?count160 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count160 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners0-14
  "https://data.pdok.nl/cbs/vocab/inwoners0-14": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners0-14",
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
        var pattern = `?_r <${iri}> ?count170 .`;
        if (values.min) pattern += `filter (?count170 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count170 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners15-24
  "https://data.pdok.nl/cbs/vocab/inwoners15-24": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners15-24",
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
        var pattern = `?_r <${iri}> ?count180 .`;
        if (values.min) pattern += `filter (?count180 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count180 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners25-44
  "https://data.pdok.nl/cbs/vocab/inwoners25-44": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners25-44",
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
        var pattern = `?_r <${iri}> ?count190 .`;
        if (values.min) pattern += `filter (?count190 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count190 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners45-64
  "https://data.pdok.nl/cbs/vocab/inwoners45-64": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners45-64",
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
        var pattern = `?_r <${iri}> ?count200 .`;
        if (values.min) pattern += `filter (?count200 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count200 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners65+
  "https://data.pdok.nl/cbs/vocab/inwoners65+": {
    iri: "https://data.pdok.nl/cbs/vocab/inwoners65+",
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
        var pattern = `?_r <${iri}> ?count210 .`;
        if (values.min) pattern += `filter (?count210 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count210 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:kinderdagverblijfAfstand
  "https://data.pdok.nl/cbs/vocab/kinderdagverblijfAfstand": {
    iri: "https://data.pdok.nl/cbs/vocab/kinderdagverblijfAfstand",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count220 .`;
        if (values.min) pattern += `filter (xsd:float(?count220) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:float(?count220) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:mannen
  "https://data.pdok.nl/cbs/vocab/mannen": {
    iri: "https://data.pdok.nl/cbs/vocab/mannen",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?some ; cbs:inwoners ?all .
        filter (?some > 5.0e1)
        bind (?some / ?all * 1.0e2 as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `
          ?_r <${iri}> ?some220 ; cbs:inwoners ?all220 .
          filter (?some220 > 5.0e1)
          bind (?some220 / ?all220 * 1.0e2) as ?value220) `;
        if (values.min) pattern += `filter (?value220 >= ${values.min}) `;
        if (values.max) pattern += `filter (?value220 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:marokkanen
  "https://data.pdok.nl/cbs/vocab/marokkanen": {
    iri: "https://data.pdok.nl/cbs/vocab/marokkanen",
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
        var pattern = `?_r <${iri}> ?count230 .`;
        if (values.min) pattern += `filter (?count230 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count230 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:meergezinswoningen
  "https://data.pdok.nl/cbs/vocab/meergezinswoningen": {
    iri: "https://data.pdok.nl/cbs/vocab/meergezinswoningen",
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
        var pattern = `?_r <${iri}> ?count240 .`;
        if (values.min) pattern += `filter (?count240 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count240 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:motortweewielers
  "https://data.pdok.nl/cbs/vocab/motortweewielers": {
    iri: "https://data.pdok.nl/cbs/vocab/motortweewielers",
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
        var pattern = `?_r <${iri}> ?count250 .`;
        if (values.min) pattern += `filter (?count250 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count250 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:nietwesterseAllochtonen
  "https://data.pdok.nl/cbs/vocab/nietwesterseAllochtonen": {
    iri: "https://data.pdok.nl/cbs/vocab/nietwesterseAllochtonen",
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
        var pattern = `?_r <${iri}> ?count260 .`;
        if (values.min) pattern += `filter (?count260 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count260 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:omgevingsadressendichtheid
  "https://data.pdok.nl/cbs/vocab/omgevingsadressendichtheid": {
    iri: "https://data.pdok.nl/cbs/vocab/omgevingsadressendichtheid",
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
        var pattern = `?_r <${iri}> ?count270 .`;
        if (values.min) pattern += `filter (?count270 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count270 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:ongehuwd
  "https://data.pdok.nl/cbs/vocab/ongehuwd": {
    iri: "https://data.pdok.nl/cbs/vocab/ongehuwd",
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
        var pattern = `?_r <${iri}> ?count280 .`;
        if (values.min) pattern += `filter (?count280 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count280 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:oppervlakte
  "https://data.pdok.nl/cbs/vocab/oppervlakte": {
    iri: "https://data.pdok.nl/cbs/vocab/oppervlakte",
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
        var pattern = `?_r <${iri}> ?count290 .`;
        if (values.min) pattern += `filter (?count290 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count290 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:oppervlakteLand
  "https://data.pdok.nl/cbs/vocab/oppervlakteLand": {
    iri: "https://data.pdok.nl/cbs/vocab/oppervlakteLand",
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
        var pattern = `?_r <${iri}> ?count291 .`;
        if (values.min) pattern += `filter (?count291 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count291 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:oppervlakteWater
  "https://data.pdok.nl/cbs/vocab/oppervlakteWater": {
    iri: "https://data.pdok.nl/cbs/vocab/oppervlakteWater",
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
        var pattern = `?_r <${iri}> ?count292 .`;
        if (values.min) pattern += `filter (?count292 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count292 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautos
  "https://data.pdok.nl/cbs/vocab/personenautos": {
    iri: "https://data.pdok.nl/cbs/vocab/personenautos",
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
        var pattern = `?_r <${iri}> ?count300 .`;
        if (values.min) pattern += `filter (?count300 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count300 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautos0-5
  "https://data.pdok.nl/cbs/vocab/personenautos0-5": {
    iri: "https://data.pdok.nl/cbs/vocab/personenautos0-5",
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
        var pattern = `?_r <${iri}> ?count301 .`;
        if (values.min) pattern += `filter (?count301 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count301 <= ${values.max}) `;
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
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?count302 .`;
        if (values.min) pattern += `filter (?count302 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count302 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautosNaarOppervlakte
  "https://data.pdok.nl/cbs/vocab/personenautosNaarOppervlakte": {
    iri: "https://data.pdok.nl/cbs/vocab/personenautosNaarOppervlakte",
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
        var pattern = `?_r <${iri}> ?count303 .`;
        if (values.min) pattern += `filter (?count303 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count303 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautosPerHuishouden
  "https://data.pdok.nl/cbs/vocab/personenautosPerHuishouden": {
    iri: "https://data.pdok.nl/cbs/vocab/personenautosPerHuishouden",
    facetType: "slider",
    label: "TODO",
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
        var pattern = `?_r <${iri}> ?count304 .`;
        if (values.min) pattern += `filter (?count304 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count304 <= ${values.max}) `;
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
  // cbs:vrouwen
  "https://data.pdok.nl/cbs/vocab/vrouwen": {
    iri: "https://data.pdok.nl/cbs/vocab/vrouwen",
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
        var pattern = `?_r <${iri}> ?count310 .`;
        if (values.min) pattern += `filter (?count310 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count310 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:water
  "https://data.pdok.nl/cbs/vocab/water": {
    iri: "https://data.pdok.nl/cbs/vocab/water",
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel {
        values (?_value ?_valueLabel) {
          ("false"^^xsd:boolean "❌")
          ("true"^^xsd:boolean "✓")
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
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
        var pattern = `?_r <${iri}> ?count320 .`;
        if (values.min) pattern += `filter (?count320 >= ${values.min}) `;
        if (values.max) pattern += `filter (?count320 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // iisg:area
  "https://iisg.amsterdam/vocab/area": {
    iri: "https://iisg.amsterdam/vocab/area",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) { return null; }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?value .`;
        if (values.min) pattern += `filter (?value >= ${values.min}) `;
        if (values.max) pattern += `filter (?value <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // iisg:cowEnd
  "https://iisg.amsterdam/vocab/cowEnd": {
    iri: "https://iisg.amsterdam/vocab/cowEnd",
    facetType: "slider",
    label: "Eind datum",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:dateTime(?value)) as ?_min) (max(xsd:dateTime(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?date1 .`;
        if (values.min) pattern += `filter (xsd:dateTime(?date1) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:dateTime(?date1) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // iisg:cowStart
  "https://iisg.amsterdam/vocab/cowStart": {
    iri: "https://iisg.amsterdam/vocab/cowStart",
    facetType: "slider",
    label: "Begin datum",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:dateTime(?value)) as ?_min) (max(xsd:dateTime(?value)) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `?_r <${iri}> ?date2 .`;
        if (values.min) pattern += `filter (xsd:dateTime(?date2) >= ${values.min}) `;
        if (values.max) pattern += `filter (xsd:dateTime(?date2) <= ${values.max}) `;
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
