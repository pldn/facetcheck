import {FacetConfig,toEntity} from 'facetConfUtils'
import * as _ from 'lodash'
const FACETS: { [property: string]: FacetConfig } = {
  "gebouwsoort": {
    // //iri: 'gebouwsoort', // Dummy IRI is required.
    label: "Soort gebouw",
    facetType: "multiselect",
    facetValues: [{
       label: "Water",
       value: "http://bag.basisregistraties.overheid.nl/def/bag#Water"
     }
     ,
     {
       label: "Weg",
       value: "http://bag.basisregistraties.overheid.nl/def/bag#Weg"
     }
   ],
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r a <${v.value}> .`).join('} union {')
      }
    }
  },
  "krimpgebied": {
    // //iri: 'http://purl.org/dc/terms/partOf', // Dummy IRI is required.
    facetType: "multiselect",
    label: "Krimpgebied",
    getFacetValuesQuery: iri => { return `
      select ?_value ?_valueLabel {
        values (?_value ?_valueLabel) {
          ("false"^^xsd:boolean "❌")
          ("true"^^xsd:boolean "✓")
        }
      }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        if (values.length === 2) {
            //no need to apply pattern. should be either true or false
            return;
        }
        // console.log(values)
        const val = values[0]
        if (val.value === '1') {
          return `?_r <${iri}> [] .`;
        } else if (val.value === '0') {
          return [
          `filter not exists { ?_r <${iri}> [] }`,
          // `?_r <${iri}> ${toEntity(val)}`
          ].join('} UNION {')
        }
      }
    }
  },
  // brt:status
  "http://brt.basisregistraties.overheid.nl/def/top10nl#status": {
    // //iri: "http://brt.basisregistraties.overheid.nl/def/top10nl#status",
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
  // cbs:afstandCafé
  "https://triply.cc/cbs/def/afstandCafé": {
    // //iri: "https://triply.cc/cbs/def/afstandCafé",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count10 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count10) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count10) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:antillianen
  "https://triply.cc/cbs/def/antillianen": {
    ////iri: "https://triply.cc/cbs/def/antillianen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count11 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count11) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count11) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:attractieAfstand
  "https://triply.cc/cbs/def/attractieAfstand": {
    ////iri: "https://triply.cc/cbs/def/attractieAfstand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count20 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count20) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count20) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingen
  "https://triply.cc/cbs/def/bedrijfsvestigingen": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count29 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count29 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count29 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenA
  "https://triply.cc/cbs/def/bedrijfsvestigingenA": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenA",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count30 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count30 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count30 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenBF
  "https://triply.cc/cbs/def/bedrijfsvestigingenBF": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenBF",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count .`;
        if (_.isFinite(values.min)) pattern += `filter(?count >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenGI
  "https://triply.cc/cbs/def/bedrijfsvestigingenGI": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenGI",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count40 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count40 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count40 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenHJ
  "https://triply.cc/cbs/def/bedrijfsvestigingenHJ": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenHJ",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count50 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count50 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count50 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenKL
  "https://triply.cc/cbs/def/bedrijfsvestigingenKL": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenKL",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count60 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count60 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count60 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenMN
  "https://triply.cc/cbs/def/bedrijfsvestigingenMN": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenMN",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count70 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count70 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count70 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingenRU
  "https://triply.cc/cbs/def/bedrijfsvestigingenRU": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsvestigingenRU",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count80 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count80 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count80 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bedrijfsmotorvoertuigen
  "https://triply.cc/cbs/def/bedrijfsmotorvoertuigen": {
    ////iri: "https://triply.cc/cbs/def/bedrijfsmotorvoertuigen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count81 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count81 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count81 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bevolkingsdichtheid
  "https://triply.cc/cbs/def/bevolkingsdichtheid": {
    ////iri: "https://triply.cc/cbs/def/bevolkingsdichtheid",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count82 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count82 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count82 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bibliotheek
  "https://triply.cc/cbs/def/bibliotheek": {
    ////iri: "https://triply.cc/cbs/def/bibliotheek",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count83 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count83) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count83) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bioscoopAfstand
  "https://triply.cc/cbs/def/bioscoopAfstand": {
    ////iri: "https://triply.cc/cbs/def/bioscoopAfstand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count84 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count84) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count84) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bouwklasse-1999
  "https://triply.cc/cbs/def/bouwklasse-1999": {
    ////iri: "https://triply.cc/cbs/def/bouwklasse-1999",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count85 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count85 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count85 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:bouwklasse2000+
  "https://triply.cc/cbs/def/bouwklasse2000+": {
    ////iri: "https://triply.cc/cbs/def/bouwklasse2000+",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count86 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count86 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count86 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:brandweer
  "https://triply.cc/cbs/def/brandweer": {
    ////iri: "https://triply.cc/cbs/def/brandweer",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count87 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count87) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count87) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:buitenpolikliniekAfstand
  "https://triply.cc/cbs/def/buitenpolikliniekAfstand": {
    //iri: "https://triply.cc/cbs/def/buitenpolikliniekAfstand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count88 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count88) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count88) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:buitenschoolseopvangAfstand
  "https://triply.cc/cbs/def/buitenschoolseopvangAfstand": {
    //iri: "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count89 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count89) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count89) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:cafetariumAfstand
  "https://triply.cc/cbs/def/cafetariumAfstand": {
    //iri: "https://triply.cc/cbs/def/cafetariumAfstand",
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
      if (values.min !== undefined || values.max !== undefined) {
        var pattern = `?_r <${iri}> ?count891 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count891) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count891) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:geboortePercentage
  "https://triply.cc/cbs/def/geboortePercentage": {
    //iri: "https://triply.cc/cbs/def/geboortePercentage",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count893 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count893 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count893 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:gehuwd
  "https://triply.cc/cbs/def/gehuwd": {
    //iri: "https://triply.cc/cbs/def/gehuwd",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count90 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count90 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count90 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:gescheiden
  "https://triply.cc/cbs/def/gescheiden": {
    //iri: "https://triply.cc/cbs/def/gescheiden",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count100 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count100 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count100 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:hotelAfstand
  "https://triply.cc/cbs/def/hotelAfstand": {
    //iri: "https://triply.cc/cbs/def/hotelAfstand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?value100 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?value100) >= ${values.min})` ;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?value100) <= ${values.max})`;
        return pattern;
      }
    }
  },
  // cbs:huishoudenGrootte
  "https://triply.cc/cbs/def/huishoudenGrootte": {
    //iri: "https://triply.cc/cbs/def/huishoudenGrootte",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count110 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count110) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count110) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:huishoudens
  "https://triply.cc/cbs/def/huishoudens": {
    //iri: "https://triply.cc/cbs/def/huishoudens",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count120 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count120 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count120 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:huishoudensMetKinderen
  "https://triply.cc/cbs/def/huishoudensMetKinderen": {
    //iri: "https://triply.cc/cbs/def/huishoudensMetKinderen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count130 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count130) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count130) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:huishoudensZonderKinderen
  "https://triply.cc/cbs/def/huishoudensZonderKinderen": {
    //iri: "https://triply.cc/cbs/def/huishoudensZonderKinderen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count140 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count140 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count140 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:ijsbaan
  "https://triply.cc/cbs/def/ijsbaan": {
    //iri: "https://triply.cc/cbs/def/ijsbaan",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count150 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count150) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count150) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners
  "https://triply.cc/cbs/def/inwoners": {
    //iri: "https://triply.cc/cbs/def/inwoners",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count160 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count160 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count160 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners0-14
  "https://triply.cc/cbs/def/inwoners0-14": {
    //iri: "https://triply.cc/cbs/def/inwoners0-14",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count170 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count170 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count170 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners15-24
  "https://triply.cc/cbs/def/inwoners15-24": {
    //iri: "https://triply.cc/cbs/def/inwoners15-24",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count180 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count180 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count180 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners25-44
  "https://triply.cc/cbs/def/inwoners25-44": {
    //iri: "https://triply.cc/cbs/def/inwoners25-44",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count190 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count190 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count190 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners45-64
  "https://triply.cc/cbs/def/inwoners45-64": {
    //iri: "https://triply.cc/cbs/def/inwoners45-64",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count200 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count200 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count200 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:inwoners65+
  "https://triply.cc/cbs/def/inwoners65+": {
    //iri: "https://triply.cc/cbs/def/inwoners65+",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count210 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count210 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count210 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:kinderdagverblijfAfstand
  "https://triply.cc/cbs/def/kinderdagverblijfAfstand": {
    //iri: "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count220 .`;
        if (_.isFinite(values.min)) pattern += `filter (xsd:float(?count220) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (xsd:float(?count220) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:mannen
  "https://triply.cc/cbs/def/mannen": {
    //iri: "https://triply.cc/cbs/def/mannen",
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
        var pattern = `?_r <${iri}> ?count220 .`;
          if (values.min) pattern += `filter (?count220 >= ${values.min}) `;
          if (values.max) pattern += `filter (?count220 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:mannen-procent
  "https://triply.cc/cbs/def/mannen-procent": {
    //iri: "https://triply.cc/cbs/def/mannen-procent",
    facetType: "slider",
    label: "Percentage mannen (%)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r cbs:mannen ?some1 ; cbs:inwoners ?all1 .
        filter (?some1 > 5.0e1)
        bind (xsd:double(?some1) / xsd:double(?all1) * 1.0e2 as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
          ?_r cbs:mannen ?some1 ; cbs:inwoners ?all1 .
          filter (xsd:double(?some1) > 5.0e1)
          bind (xsd:double(?some1) / xsd:double(?all1) * 1.0e2 as ?value1) `;
        if (_.isFinite(values.min)) pattern += `filter (?value1 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?value1 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:marokkanen
  "https://triply.cc/cbs/def/marokkanen": {
    //iri: "https://triply.cc/cbs/def/marokkanen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count230 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count230 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count230 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:meergezinswoningen
  "https://triply.cc/cbs/def/meergezinswoningen": {
    //iri: "https://triply.cc/cbs/def/meergezinswoningen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count240 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count240 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count240 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:motortweewielers
  "https://triply.cc/cbs/def/motortweewielers": {
    //iri: "https://triply.cc/cbs/def/motortweewielers",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count250 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count250 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count250 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:nietwesterseAllochtonen
  "https://triply.cc/cbs/def/nietwesterseAllochtonen": {
    //iri: "https://triply.cc/cbs/def/nietwesterseAllochtonen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count260 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count260 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count260 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:omgevingsadressendichtheid
  "https://triply.cc/cbs/def/omgevingsadressendichtheid": {
    //iri: "https://triply.cc/cbs/def/omgevingsadressendichtheid",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count270 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count270 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count270 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:ongehuwd
  "https://triply.cc/cbs/def/ongehuwd": {
    //iri: "https://triply.cc/cbs/def/ongehuwd",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count280 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count280 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count280 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:oppervlakte
  "https://triply.cc/cbs/def/oppervlakte": {
    //iri: "https://triply.cc/cbs/def/oppervlakte",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count290 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count290 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count290 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:oppervlakteLand
  "https://triply.cc/cbs/def/oppervlakteLand": {
    //iri: "https://triply.cc/cbs/def/oppervlakteLand",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count291 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count291 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count291 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:oppervlakteWater
  "https://triply.cc/cbs/def/oppervlakteWater": {
    //iri: "https://triply.cc/cbs/def/oppervlakteWater",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count292 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count292 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count292 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautos
  "https://triply.cc/cbs/def/personenautos": {
    //iri: "https://triply.cc/cbs/def/personenautos",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count300 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count300 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count300 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautos0-5
  "https://triply.cc/cbs/def/personenautos0-5": {
    //iri: "https://triply.cc/cbs/def/personenautos0-5",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count301 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count301 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count301 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautos6+
  "https://triply.cc/cbs/def/personenautos6+": {
    //iri: "https://triply.cc/cbs/def/personenautos6+",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count302 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count302 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count302 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautosNaarOppervlakte
  "https://triply.cc/cbs/def/personenautosNaarOppervlakte": {
    //iri: "https://triply.cc/cbs/def/personenautosNaarOppervlakte",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count303 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count303 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count303 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:personenautosPerHuishouden
  "https://triply.cc/cbs/def/personenautosPerHuishouden": {
    //iri: "https://triply.cc/cbs/def/personenautosPerHuishouden",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count304 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count304 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count304 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:stedelijkheid
  "https://triply.cc/cbs/def/stedelijkheid": {
    //iri: "https://triply.cc/cbs/def/stedelijkheid",
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
  // cbs:treinstation
  "https://triply.cc/cbs/def/treinstation": {
    //iri: "https://triply.cc/cbs/def/treinstation",
    facetType: "slider",
    label: "Afstand tot treinstation (km)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?afstand . bind (xsd:float(?afstand) as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count1010 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count1010) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count1010) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:vrouwen
  "https://triply.cc/cbs/def/vrouwen": {
    //iri: "https://triply.cc/cbs/def/vrouwen",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count310 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count310 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count310 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:vrouwen-procent
  "https://triply.cc/cbs/def/vrouwen-procent": {
    //iri: "https://triply.cc/cbs/def/vrouwen-procent",
    facetType: "slider",
    label: "Percentage vrouwen (%)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r cbs:vrouwen ?some2 ; cbs:inwoners ?all2 .
        filter (?some2 > 5.0e1)
        bind (xsd:double(?some2) / xsd:double(?all2) * 1.0e2 as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
          ?_r cbs:vrouwen ?some2 ; cbs:inwoners ?all2 .
          filter (xsd:double(?some2) > 5.0e1)
          bind (xsd:double(?some2) / xsd:double(?all2) * 1.0e2 as ?value2) `;
        if (_.isFinite(values.min)) pattern += `filter (?value2 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?value2 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // cbs:water
  "https://triply.cc/cbs/def/water": {
    //iri: "https://triply.cc/cbs/def/water",
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
  "https://triply.cc/cbs/def/woz": {
    //iri: "https://triply.cc/cbs/def/woz",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?count320 .`;
        if (_.isFinite(values.min)) pattern += `filter (?count320 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?count320 <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // iisg:area
  "https://iisg.amsterdam/def/area": {
    //iri: "https://iisg.amsterdam/def/area",
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) { return null; }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?value .`;
        if (_.isFinite(values.min)) pattern += `filter (?value >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (?value <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // iisg:cowEnd
  "https://iisg.amsterdam/def/cowEnd": {
    //iri: "https://iisg.amsterdam/def/cowEnd",
    facetType: "slider",
    label: "Eind datum",
    getFacetValuesQuery: iri => { return `
      select distinct (min(year(xsd:dateTime(?value))) as ?_min) (max(year(xsd:dateTime(?value))) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?date1 .`;
        if (_.isFinite(values.min)) pattern += `filter (year(xsd:dateTime(?date1)) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (year(xsd:dateTime(?date1)) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // iisg:cowStart
  "https://iisg.amsterdam/def/cowStart": {
    //iri: "https://iisg.amsterdam/def/cowStart",
    facetType: "slider",
    label: "Begin datum",
    getFacetValuesQuery: iri => { return `
      select distinct (min(year(xsd:dateTime(?value))) as ?_min) (max(year(xsd:dateTime(?value))) as ?_max) {
        ?_r <${iri}> ?value .
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?date2 .`;
        if (_.isFinite(values.min)) pattern += `filter (year(xsd:dateTime(?date2)) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (year(xsd:dateTime(?date2)) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // rce:bouwjaar
  "https://cultureelerfgoed.nl/vocab/bouwjaar": {
    //iri: "https://cultureelerfgoed.nl/vocab/bouwjaar",
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
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `?_r <${iri}> ?year .`;
        if (_.isFinite(values.min)) pattern += `filter (year(xsd:dateTime(?year)) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter (year(xsd:dateTime(?year)) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // rce:monumentCode
  "https://cultureelerfgoed.nl/vocab/monumentCode": {
    //iri: "https://cultureelerfgoed.nl/vocab/monumentCode",
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
    //iri: "https://cultureelerfgoed.nl/vocab/provincie",
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
