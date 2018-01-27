import {ClassConfig} from 'facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  // brt:Gebouw
  "http://brt.basisregistraties.overheid.nl/def/top10nl#Gebouw": {
    default: false,
    iri: "http://brt.basisregistraties.overheid.nl/def/top10nl#Gebouw",
    label: "Gebouw",
    facets: [
      "gebouwsoort",
      "http://brt.basisregistraties.overheid.nl/def/top10nl#status"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o .
        optional { ?p rdfs:label ?pLabel . }
        optional { ?o rdfs:label ?oLabel . }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt .
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Buurt
  "https://triply.cc/cbs/def/Buurt": {
    default: true,
    iri: "https://triply.cc/cbs/def/Buurt",
    label: "Buurt",
    facets: [
      "https://triply.cc/energie/def/aardgasverbruikKoopwoning",
      "https://triply.cc/energie/def/elektriciteitsverbruikKoopwoning",
      "https://triply.cc/energie/def/huurwoningen",
      "https://triply.cc/energie/def/koopwoningen",
      "https://triply.cc/energie/def/reëleBesparingspotentieAlleMaatregelen",
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://triply.cc/cbs/def/stedelijkheid",
      "https://triply.cc/cbs/def/afstandCafé",
      "https://triply.cc/cbs/def/attractieAfstand",
      "https://triply.cc/cbs/def/bedrijfsvestigingen",
      "https://triply.cc/cbs/def/bevolkingsdichtheid",
      "https://triply.cc/cbs/def/bouwklasse-1999",
      "https://triply.cc/cbs/def/bouwklasse2000+",
      "https://triply.cc/cbs/def/brandweer",
      "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
      "https://triply.cc/cbs/def/geboortePercentage",
      "https://triply.cc/cbs/def/gehuwd",
      "https://triply.cc/cbs/def/gescheiden",
      "https://triply.cc/cbs/def/huishoudensMetKinderen",
      "https://triply.cc/cbs/def/huishoudensZonderKinderen",
      "https://triply.cc/cbs/def/inwoners",
      "https://triply.cc/cbs/def/inwoners0-14",
      "https://triply.cc/cbs/def/inwoners15-24",
      "https://triply.cc/cbs/def/inwoners25-44",
      "https://triply.cc/cbs/def/inwoners45-64",
      "https://triply.cc/cbs/def/inwoners65+",
      "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
      "https://triply.cc/cbs/def/mannen",
      "https://triply.cc/cbs/def/meergezinswoningen",
      "https://triply.cc/cbs/def/motortweewielers",
      "https://triply.cc/cbs/def/ongehuwd",
      "https://triply.cc/cbs/def/oppervlakte",
      "https://triply.cc/cbs/def/oppervlakteLand",
      "https://triply.cc/cbs/def/oppervlakteWater",
      "https://triply.cc/cbs/def/personenautos0-5",
      "https://triply.cc/cbs/def/personenautos6+",
      "https://triply.cc/cbs/def/treinstation",
      "https://triply.cc/cbs/def/vrouwen",
      "https://triply.cc/cbs/def/woz"
    ],
    classToQueryPattern: (iri:string) => `
      graph graph:CBS-2015 {
        ?_r rdf:type <${iri}> .
      }`,
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        {
          graph graph:CBS-2015 {
            <${iri}> ?p ?o
            optional { ?p rdfs:label ?pLabel . }
            optional { ?o rdfs:label ?oLabel . }
            optional {
              <${iri}> geo:hasGeometry ?geo .
              ?geo geo:asWKT ?wkt .
            }
          }
        } union {
          graph graph:CBS-energie-2015 {
            <${iri}> ?p ?o
            optional { ?p rdfs:label ?pLabel . }
            optional { ?o rdfs:label ?oLabel . }
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Wijk
  "https://triply.cc/cbs/def/Wijk": {
    default: false,
    iri: "https://triply.cc/cbs/def/Wijk",
    label: "Wijk",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://triply.cc/cbs/def/stedelijkheid",
      "https://triply.cc/cbs/def/afstandCafé",
      "https://triply.cc/cbs/def/attractieAfstand",
      "https://triply.cc/cbs/def/bedrijfsvestigingen",
      "https://triply.cc/cbs/def/bevolkingsdichtheid",
      "https://triply.cc/cbs/def/bouwklasse-1999",
      "https://triply.cc/cbs/def/bouwklasse2000+",
      "https://triply.cc/cbs/def/brandweer",
      "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
      "https://triply.cc/cbs/def/geboortePercentage",
      "https://triply.cc/cbs/def/gehuwd",
      "https://triply.cc/cbs/def/gescheiden",
      "https://triply.cc/cbs/def/huishoudenGrootte",
      "https://triply.cc/cbs/def/huishoudensMetKinderen",
      "https://triply.cc/cbs/def/huishoudensZonderKinderen",
      "https://triply.cc/cbs/def/ijsbaan",
      "https://triply.cc/cbs/def/inwoners",
      "https://triply.cc/cbs/def/inwoners0-14",
      "https://triply.cc/cbs/def/inwoners15-24",
      "https://triply.cc/cbs/def/inwoners25-44",
      "https://triply.cc/cbs/def/inwoners45-64",
      "https://triply.cc/cbs/def/inwoners65+",
      "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
      "https://triply.cc/cbs/def/mannen",
      "https://triply.cc/cbs/def/meergezinswoningen",
      "https://triply.cc/cbs/def/motortweewielers",
      "https://triply.cc/cbs/def/ongehuwd",
      "https://triply.cc/cbs/def/oppervlakte",
      "https://triply.cc/cbs/def/oppervlakteLand",
      "https://triply.cc/cbs/def/oppervlakteWater",
      "https://triply.cc/cbs/def/personenautos0-5",
      "https://triply.cc/cbs/def/personenautos6+",
      "https://triply.cc/cbs/def/treinstation",
      "https://triply.cc/cbs/def/vrouwen",
      "https://triply.cc/cbs/def/woz"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph graph:CBS-2015 {
          <${iri}> ?p ?o .
          optional { ?p rdfs:label ?pLabel . }
          optional { ?o rdfs:label ?oLabel . }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Gemeente
  "https://triply.cc/cbs/def/Gemeente": {
    default: false,
    iri: "https://triply.cc/cbs/def/Gemeente",
    label: "Gemeente",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "krimpgebied",
      "https://triply.cc/cbs/def/stedelijkheid",
      "https://triply.cc/cbs/def/afstandCafé",
      "https://triply.cc/cbs/def/attractieAfstand",
      "https://triply.cc/cbs/def/bedrijfsvestigingen",
      "https://triply.cc/cbs/def/bevolkingsdichtheid",
      "https://triply.cc/cbs/def/bouwklasse-1999",
      "https://triply.cc/cbs/def/bouwklasse2000+",
      "https://triply.cc/cbs/def/brandweer",
      "https://triply.cc/cbs/def/buitenschoolseopvangAfstand",
      "https://triply.cc/cbs/def/geboortePercentage",
      "https://triply.cc/cbs/def/gehuwd",
      "https://triply.cc/cbs/def/gescheiden",
      "https://triply.cc/cbs/def/huishoudensMetKinderen",
      "https://triply.cc/cbs/def/huishoudensZonderKinderen",
      "https://triply.cc/cbs/def/ijsbaan",
      "https://triply.cc/cbs/def/inwoners",
      "https://triply.cc/cbs/def/inwoners0-14",
      "https://triply.cc/cbs/def/inwoners15-24",
      "https://triply.cc/cbs/def/inwoners25-44",
      "https://triply.cc/cbs/def/inwoners45-64",
      "https://triply.cc/cbs/def/inwoners65+",
      "https://triply.cc/cbs/def/kinderdagverblijfAfstand",
      "https://triply.cc/cbs/def/mannen",
      "https://triply.cc/cbs/def/mannen-procent",
      "https://triply.cc/cbs/def/meergezinswoningen",
      "https://triply.cc/cbs/def/motortweewielers",
      "https://triply.cc/cbs/def/ongehuwd",
      "https://triply.cc/cbs/def/oppervlakte",
      "https://triply.cc/cbs/def/oppervlakteLand",
      "https://triply.cc/cbs/def/oppervlakteWater",
      "https://triply.cc/cbs/def/personenautos0-5",
      "https://triply.cc/cbs/def/personenautos6+",
      "https://triply.cc/cbs/def/treinstation",
      "https://triply.cc/cbs/def/vrouwen",
      "https://triply.cc/cbs/def/vrouwen-procent",
      "https://triply.cc/cbs/def/woz"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph graph:CBS-2015 {
          <${iri}> ?p ?o .
          optional { ?p rdfs:label ?pLabel . }
          optional { ?o rdfs:label ?oLabel . }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt .
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // rce:Monument
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: false,
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: [
      //"https://cultureelerfgoed.nl/vocab/provincie",
      "https://cultureelerfgoed.nl/vocab/bouwjaar",
      "https://cultureelerfgoed.nl/vocab/monumentCode"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .
        ?geo geo:asWKT ?wkt .
        <${iri}> foaf:depiction ?img .
        ?img rce:locator ?url ; rdfs:label ?imgLabel .`
      var selectPattern = `
        <${iri}> ?p ?o .
        optional { ?p rdfs:label ?pLabel . }
        optional { ?o rdfs:label ?oLabel . }
        optional {
          ?img foaf:depicts <${iri}> ; rce:locator ?url .
          optional {
            ?img rce:fotograaf ?fotograaf ;
                 dct:created ?created ;
                 dct:description ?description .
            bind (concat("“",?description,"” (",
                         ?fotograaf,", ",?created,")") as ?imgLabel)
          }
        }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt .
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  }
};
export default CLASSES
