import {FacetConfig,toEntity} from 'facetConfUtils'
import * as _ from 'lodash'
const FACETS: { [property: string]: FacetConfig } = {
  "https://triply.cc/energie/def/aardgasverbruikKoopwoning": {
    facetType: "slider",
    label: "Aardgasverbruik koopwoning",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?count1 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count1 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count1 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  "https://triply.cc/energie/def/elektriciteitsverbruikKoopwoning": {
    facetType: "slider",
    label: "Elektriciteitsverbruik koopwoning",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?count2 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count2 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count2 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  "https://triply.cc/energie/def/huurwoningen": {
    facetType: "slider",
    label: "Aantal huurwoningen",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?count3 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count3 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count3 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  "https://triply.cc/energie/def/koopwoningen": {
    facetType: "slider",
    label: "Aantal koopwoningen",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?count4 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count4 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count4 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  "https://triply.cc/energie/def/reëleBesparingspotentieAlleMaatregelen": {
    facetType: "slider",
    label: "Reële besparingspotentie (€/jaar)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph <https://triply.cc/energie/graph/2015> {
          ?_r <${iri}> ?count5 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count5 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count5 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  "gebouwsoort": {
    label: "Soort gebouw",
    facetType: "multiselect",
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r a <${v.value}> .`).join('} union {')
      }
    },
    facetValues: [
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Bezoekerscentrum", "label": "Bezoekerscentrum"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Boortoren", "label": "Boortoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Brandtoren", "label": "Brandtoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Brandweerkazerne", "label": "Brandweerkazerne"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Bunker", "label": "Bunker"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Crematorium", "label": "Crematorium"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Dok", "label": "Dok"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Elektriciteitscentrale", "label": "Elektriciteitscentrale"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Fabriek", "label": "Fabriek"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Fort", "label": "Fort"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Gemaal", "label": "Gemaal"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Gemeentehuis", "label": "Gemeentehuis"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Gevangenis", "label": "Gevangenis"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Hotel", "label": "Hotel"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Huizenblok", "label": "Huizenblok"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Kapel", "label": "Kapel"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#KasWarenhuis", "label": "KasWarenhuis"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Kasteel", "label": "Kasteel"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Kerk", "label": "Kerk"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#KerncentraleKernreactor", "label": "KerncentraleKernreactor"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#KliniekInrichtingSanatorium", "label": "KliniekInrichtingSanatorium"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Klokkentoren", "label": "Klokkentoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#KloosterAbdij", "label": "KloosterAbdij"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Koeltoren", "label": "Koeltoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Koepel", "label": "Koepel"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Kunstijsbaan", "label": "Kunstijsbaan"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Lichttoren", "label": "Lichttoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Luchtwachttoren", "label": "Luchtwachttoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Manege", "label": "Manege"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#MarkantGebouw", "label": "MarkantGebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#MilitairGebouw", "label": "MilitairGebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Moskee", "label": "Moskee"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Museum", "label": "Museum"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#OverigReligieusGebouw", "label": "OverigReligieusGebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Overig_gebouw", "label": "Overig_gebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#ParkeerdakParkeerdekParkeergarage", "label": "ParkeerdakParkeerdekParkeergarage"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Peilmeetstation", "label": "Peilmeetstation"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Politiebureau", "label": "Politiebureau"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Pompstation", "label": "Pompstation"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Postkantoor", "label": "Postkantoor"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#PsychiatrischZiekenhuisPsychiatrischCentrum", "label": "PsychiatrischZiekenhuisPsychiatrischCentrum"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Radarpost", "label": "Radarpost"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Radartoren", "label": "Radartoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#RadiotorenTelevisietoren", "label": "RadiotorenTelevisietoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Recreatiecentrum", "label": "Recreatiecentrum"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Reddingboothuisje", "label": "Reddingboothuisje"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Remise", "label": "Remise"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Rune", "label": "Rune"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Schaapskooi", "label": "Schaapskooi"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#School", "label": "School"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Schoorsteen", "label": "Schoorsteen"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Silo", "label": "Silo"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Sporthal", "label": "Sporthal"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Stadion", "label": "Stadion"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#StadskantoorHulpsecretarie", "label": "StadskantoorHulpsecretarie"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Stationsgebouw", "label": "Stationsgebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Synagoge", "label": "Synagoge"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Tank", "label": "Tank"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Tankstation", "label": "Tankstation"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Telecommunicatietoren", "label": "Telecommunicatietoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Tol_gebouw", "label": "Tol_gebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Toren", "label": "Toren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Transformatorstation_gebouw", "label": "Transformatorstation_gebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Uitzichttoren", "label": "Uitzichttoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Universiteit", "label": "Universiteit"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Veiling", "label": "Veiling"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Verkeerstoren", "label": "Verkeerstoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Vuurtoren", "label": "Vuurtoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Waterradmolen", "label": "Waterradmolen"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Watertoren", "label": "Watertoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Werf_gebouw", "label": "Werf_gebouw"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Windmolen", "label": "Windmolen"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#WindmolenKorenmolen", "label": "WindmolenKorenmolen"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#WindmolenWatermolen", "label": "WindmolenWatermolen"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Windturbine", "label": "Windturbine"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Zendtoren", "label": "Zendtoren"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Ziekenhuis", "label": "Ziekenhuis"},
      {"value": "http://brt.basisregistraties.overheid.nl/def/top10nl#Zwembad_gebouw", "label": "Zwembad_gebouw"}
    ],
  },
  "krimpgebied": {
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
        const val = values[0]
        if (val.value === '1') {
          return `
            graph cbs-graph:2015 {
              ?_r ?p ?o .
            }
            ?_r geo:sfWithin/rdf:type cbs:Krimpgebied .`;
        } else if (val.value === '0') {
          return `
            graph cbs-graph:2015 {
              ?_r ?p ?o .
            }
            filter not exists {
              ?_r geo:sfWithin/rdf:type cbs:Krimpgebied .
            }`;
        }
      }
    }
  },
  // brt:status
  "http://brt.basisregistraties.overheid.nl/def/top10nl#status": {
    facetType: "multiselect",
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `?_r a <${v.value}> .`).join('} union {')
      }
    },
    facetValues: [
      {"value": "http://brt.basisregistraties.overheid.nl/id/begrip/BuitenGebruik", "label": "Buiten gebruik"},
      {"value": "http://brt.basisregistraties.overheid.nl/id/begrip/InGebruik", "label": "In gebruik"},
      {"value": "http://brt.basisregistraties.overheid.nl/id/begrip/InUitvoering", "label": "In uitvoering"}
    ]
  },
  // cbs:afstandCafé
  "https://triply.cc/cbs/def/afstandCafé": {
    facetType: "slider",
    label: "Afstand tot café (km)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?afstand .
          bind(xsd:float(?afstand) as ?value)
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count10 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(xsd:float(?count10) >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(xsd:float(?count10) <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:attractieAfstand
  "https://triply.cc/cbs/def/attractieAfstand": {
    facetType: "slider",
    label: "Afstand tot attractie (km)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?afstand .
           bind(xsd:float(?afstand) as ?value)
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count20 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(xsd:float(?count20) >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(xsd:float(?count20) <= ${values.max}) `;
        }
        pattern += `}`
        return pattern;
      }
    }
  },
  // cbs:bedrijfsvestigingen
  "https://triply.cc/cbs/def/bedrijfsvestigingen": {
    facetType: "slider",
    label: "Bedrijven",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count30 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count30 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count30 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:bevolkingsdichtheid
  "https://triply.cc/cbs/def/bevolkingsdichtheid": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count40 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count40 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count40 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:bouwklasse-1999
  "https://triply.cc/cbs/def/bouwklasse-1999": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count50 .`;
        if (_.isFinite(values.min)) {
          pattern += `filter(?count50 >= ${values.min}) `;
        }
        if (_.isFinite(values.max)) {
          pattern += `filter(?count50 <= ${values.max}) `;
        }
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:bouwklasse2000+
  "https://triply.cc/cbs/def/bouwklasse2000+": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count60 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count60 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count60 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:brandweer
  "https://triply.cc/cbs/def/brandweer": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count70 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count70) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count70) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:buitenschoolseopvangAfstand
  "https://triply.cc/cbs/def/buitenschoolseopvangAfstand": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count80 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count80) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count80) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:geboortePercentage
  "https://triply.cc/cbs/def/geboortePercentage": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count90 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count90 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count90 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:gehuwd
  "https://triply.cc/cbs/def/gehuwd": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count100 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count100 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count100 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:gescheiden
  "https://triply.cc/cbs/def/gescheiden": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count110 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count110 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count110 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:huishoudenGrootte
  "https://triply.cc/cbs/def/huishoudenGrootte": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count120 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count120) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count120) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:huishoudensMetKinderen
  "https://triply.cc/cbs/def/huishoudensMetKinderen": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count130 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count130) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count130) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:huishoudensZonderKinderen
  "https://triply.cc/cbs/def/huishoudensZonderKinderen": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count140 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count140 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count140 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:ijsbaan
  "https://triply.cc/cbs/def/ijsbaan": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-grahp:2015 { ?_r <${iri}> ?count150 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count150) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count150) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:inwoners
  "https://triply.cc/cbs/def/inwoners": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count160 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count160 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count160 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:inwoners0-14
  "https://triply.cc/cbs/def/inwoners0-14": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count170 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count170 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count170 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:inwoners15-24
  "https://triply.cc/cbs/def/inwoners15-24": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count180 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count180 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count180 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:inwoners25-44
  "https://triply.cc/cbs/def/inwoners25-44": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count190 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count190 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count190 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:inwoners45-64
  "https://triply.cc/cbs/def/inwoners45-64": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count200 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count200 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count200 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:inwoners65+
  "https://triply.cc/cbs/def/inwoners65+": {
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
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count210 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count210 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count210 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:kinderdagverblijfAfstand
  "https://triply.cc/cbs/def/kinderdagverblijfAfstand": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(xsd:float(?value)) as ?_min) (max(xsd:float(?value)) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count220 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count220) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count220) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:mannen
  "https://triply.cc/cbs/def/mannen": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (values.min || values.max) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count230 .`;
        if (values.min) pattern += `filter(?count230 >= ${values.min}) `;
        if (values.max) pattern += `filter(?count230 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:mannen-procent
  "https://triply.cc/cbs/def/mannen-procent": {
    facetType: "slider",
    label: "Percentage mannen (%)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r cbs:mannen ?mannen ;
              cbs:inwoners ?inwoners .
          filter(?mannen > 5.0e1)
          bind(xsd:double(?mannen) / xsd:double(?inwoners) * 1.0e2 as ?value)
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
          graph cbs-graph:2015 {
            ?_r cbs:mannen ?mannen240 ;
                cbs:inwoners ?inwoners240 .
            filter(xsd:double(?mannen240) > 5.0e1)
            bind(xsd:double(?mannen240) / xsd:double(?inwoners240) * 1.0e2 as ?value240) `;
        if (_.isFinite(values.min)) pattern += `filter(?value240 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?value240 <= ${values.max}) `;
        pattern += `}`;
        return pattern;

      }
    }
  },
  // cbs:meergezinswoningen
  "https://triply.cc/cbs/def/meergezinswoningen": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count250 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count250 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count250 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:motortweewielers
  "https://triply.cc/cbs/def/motortweewielers": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count260 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count260 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count260 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:ongehuwd
  "https://triply.cc/cbs/def/ongehuwd": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count270 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count270 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count270 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:oppervlakte
  "https://triply.cc/cbs/def/oppervlakte": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count280 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count280 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count280 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:oppervlakteLand
  "https://triply.cc/cbs/def/oppervlakteLand": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count290 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count290 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count290 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:oppervlakteWater
  "https://triply.cc/cbs/def/oppervlakteWater": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count300 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count300 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count300 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:personenautos0-5
  "https://triply.cc/cbs/def/personenautos0-5": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count310 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count310 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count310 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:personenautos6+
  "https://triply.cc/cbs/def/personenautos6+": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count320 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count320 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count320 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:stedelijkheid
  "https://triply.cc/cbs/def/stedelijkheid": {
    facetType: "multiselect",
    getFacetValuesQuery: iri => { return `
      select distinct ?_value ?_valueLabel {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?_value .
        }
        ?_value rdfs:label ?_valueLabel .
      }`;
    },
    facetToQueryPatterns: (iri, values) => {
      if (values instanceof Array && values.length) {
        return values.map(v => `graph cbs-graph:2015 { ?_r <${iri}> ${toEntity(v)} . }`).join('} union {')
      }
    }
  },
  // cbs:treinstation
  "https://triply.cc/cbs/def/treinstation": {
    facetType: "slider",
    label: "Afstand tot treinstation (km)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        ?_r <${iri}> ?afstand . bind(xsd:float(?afstand) as ?value)
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count330 .`;
        if (_.isFinite(values.min)) pattern += `filter(xsd:float(?count330) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(xsd:float(?count330) <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:vrouwen
  "https://triply.cc/cbs/def/vrouwen": {
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
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count340 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count340 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count340 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:vrouwen-procent
  "https://triply.cc/cbs/def/vrouwen-procent": {
    facetType: "slider",
    label: "Percentage vrouwen (%)",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r cbs:vrouwen ?vrouwen ;
            cbs:inwoners ?inwoners .
          filter(?vrouwen > 5.0e1)
          bind(xsd:double(?vrouwen) / xsd:double(?inwoners) * 1.0e2 as ?value)
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `
          graph cbs-graph:2015 {
            ?_r cbs:vrouwen ?vrouwen350 ;
                cbs:inwoners ?inwoners350 .
            filter(xsd:double(?vrouwen350) > 5.0e1)
            bind(xsd:double(?vrouwen350) / xsd:double(?inwoners350) * 1.0e2 as ?value350) `;
        if (_.isFinite(values.min)) pattern += `filter(?value350 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?value350 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // cbs:woz
  "https://triply.cc/cbs/def/woz": {
    facetType: "slider",
    getFacetValuesQuery: iri => { return `
      select distinct (min(?value) as ?_min) (max(?value) as ?_max) {
        graph cbs-graph:2015 {
          ?_r <${iri}> ?value .
        }
      }`;
    },
    facetToQueryPatterns: (iri,values) => {
      if (Array.isArray(values)) {
        return null;
      }
      if (_.isFinite(values.min) || _.isFinite(values.max)) {
        var pattern = `graph cbs-graph:2015 { ?_r <${iri}> ?count360 .`;
        if (_.isFinite(values.min)) pattern += `filter(?count360 >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(?count360 <= ${values.max}) `;
        pattern += `}`;
        return pattern;
      }
    }
  },
  // rce:bouwjaar
  "https://cultureelerfgoed.nl/vocab/bouwjaar": {
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
        if (_.isFinite(values.min)) pattern += `filter(year(xsd:dateTime(?year)) >= ${values.min}) `;
        if (_.isFinite(values.max)) pattern += `filter(year(xsd:dateTime(?year)) <= ${values.max}) `;
        return pattern;
      }
    }
  },
  // rce:monumentCode
  "https://cultureelerfgoed.nl/vocab/monumentCode": {
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
