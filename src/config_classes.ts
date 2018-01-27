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
  "https://krr.triply.cc/Kadaster/cbs/def/Buurt": {
    default: true,
    iri: "https://krr.triply.cc/Kadaster/cbs/def/Buurt",
    label: "Buurt",
    facets: [
      "https://krr.triply.cc/Kadaster/cbs/def/aardgasverbruikKoopwoning",
      "https://krr.triply.cc/Kadaster/cbs/def/elektriciteitsverbruikKoopwoning",
      "https://krr.triply.cc/Kadaster/cbs/def/huurwoningen",
      "https://krr.triply.cc/Kadaster/cbs/def/koopwoningen",
      "https://krr.triply.cc/Kadaster/cbs/def/reëleBesparingspotentieAlleMaatregelen",
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://krr.triply.cc/Kadaster/cbs/def/stedelijkheid",
      "https://krr.triply.cc/Kadaster/cbs/def/afstandCafé",
      "https://krr.triply.cc/Kadaster/cbs/def/attractieAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/bedrijfsvestigingen",
      "https://krr.triply.cc/Kadaster/cbs/def/bevolkingsdichtheid",
      "https://krr.triply.cc/Kadaster/cbs/def/bouwklasse-1999",
      "https://krr.triply.cc/Kadaster/cbs/def/bouwklasse2000+",
      "https://krr.triply.cc/Kadaster/cbs/def/brandweer",
      "https://krr.triply.cc/Kadaster/cbs/def/buitenschoolseopvangAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/geboortePercentage",
      "https://krr.triply.cc/Kadaster/cbs/def/gehuwd",
      "https://krr.triply.cc/Kadaster/cbs/def/gescheiden",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudensMetKinderen",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudensZonderKinderen",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners0-14",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners15-24",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners25-44",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners45-64",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners65+",
      "https://krr.triply.cc/Kadaster/cbs/def/kinderdagverblijfAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/mannen",
      "https://krr.triply.cc/Kadaster/cbs/def/meergezinswoningen",
      "https://krr.triply.cc/Kadaster/cbs/def/motortweewielers",
      "https://krr.triply.cc/Kadaster/cbs/def/ongehuwd",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakte",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakteLand",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakteWater",
      "https://krr.triply.cc/Kadaster/cbs/def/personenautos0-5",
      "https://krr.triply.cc/Kadaster/cbs/def/personenautos6+",
      "https://krr.triply.cc/Kadaster/cbs/def/treinstation",
      "https://krr.triply.cc/Kadaster/cbs/def/vrouwen",
      "https://krr.triply.cc/Kadaster/cbs/def/woz"
    ],
    classToQueryPattern: (iri:string) => `
      graph graph:cbs-2015 {
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
          graph graph:cbs-2015 {
            <${iri}> ?p ?o
            optional { ?p rdfs:label ?pLabel . }
            optional { ?o rdfs:label ?oLabel . }
            optional {
              <${iri}> geo:hasGeometry ?geo .
              ?geo geo:asWKT ?wkt .
            }
          }
        } union {
          graph graph:cbs-energie-2015 {
            <${iri}> ?p ?o
            optional { ?p rdfs:label ?pLabel . }
            optional { ?o rdfs:label ?oLabel . }
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  // cbs:Wijk
  "https://krr.triply.cc/Kadaster/cbs/def/Wijk": {
    default: false,
    iri: "https://krr.triply.cc/Kadaster/cbs/def/Wijk",
    label: "Wijk",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://krr.triply.cc/Kadaster/cbs/def/stedelijkheid",
      "https://krr.triply.cc/Kadaster/cbs/def/afstandCafé",
      "https://krr.triply.cc/Kadaster/cbs/def/attractieAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/bedrijfsvestigingen",
      "https://krr.triply.cc/Kadaster/cbs/def/bevolkingsdichtheid",
      "https://krr.triply.cc/Kadaster/cbs/def/bouwklasse-1999",
      "https://krr.triply.cc/Kadaster/cbs/def/bouwklasse2000+",
      "https://krr.triply.cc/Kadaster/cbs/def/brandweer",
      "https://krr.triply.cc/Kadaster/cbs/def/buitenschoolseopvangAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/geboortePercentage",
      "https://krr.triply.cc/Kadaster/cbs/def/gehuwd",
      "https://krr.triply.cc/Kadaster/cbs/def/gescheiden",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudenGrootte",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudensMetKinderen",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudensZonderKinderen",
      "https://krr.triply.cc/Kadaster/cbs/def/ijsbaan",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners0-14",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners15-24",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners25-44",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners45-64",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners65+",
      "https://krr.triply.cc/Kadaster/cbs/def/kinderdagverblijfAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/mannen",
      "https://krr.triply.cc/Kadaster/cbs/def/meergezinswoningen",
      "https://krr.triply.cc/Kadaster/cbs/def/motortweewielers",
      "https://krr.triply.cc/Kadaster/cbs/def/ongehuwd",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakte",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakteLand",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakteWater",
      "https://krr.triply.cc/Kadaster/cbs/def/personenautos0-5",
      "https://krr.triply.cc/Kadaster/cbs/def/personenautos6+",
      "https://krr.triply.cc/Kadaster/cbs/def/treinstation",
      "https://krr.triply.cc/Kadaster/cbs/def/vrouwen",
      "https://krr.triply.cc/Kadaster/cbs/def/woz"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph graph:cbs-2015 {
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
  "https://krr.triply.cc/Kadaster/cbs/def/Gemeente": {
    default: false,
    iri: "https://krr.triply.cc/Kadaster/cbs/def/Gemeente",
    label: "Gemeente",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "krimpgebied",
      "https://krr.triply.cc/Kadaster/cbs/def/stedelijkheid",
      "https://krr.triply.cc/Kadaster/cbs/def/afstandCafé",
      "https://krr.triply.cc/Kadaster/cbs/def/attractieAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/bedrijfsvestigingen",
      "https://krr.triply.cc/Kadaster/cbs/def/bevolkingsdichtheid",
      "https://krr.triply.cc/Kadaster/cbs/def/bouwklasse-1999",
      "https://krr.triply.cc/Kadaster/cbs/def/bouwklasse2000+",
      "https://krr.triply.cc/Kadaster/cbs/def/brandweer",
      "https://krr.triply.cc/Kadaster/cbs/def/buitenschoolseopvangAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/geboortePercentage",
      "https://krr.triply.cc/Kadaster/cbs/def/gehuwd",
      "https://krr.triply.cc/Kadaster/cbs/def/gescheiden",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudensMetKinderen",
      "https://krr.triply.cc/Kadaster/cbs/def/huishoudensZonderKinderen",
      "https://krr.triply.cc/Kadaster/cbs/def/ijsbaan",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners0-14",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners15-24",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners25-44",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners45-64",
      "https://krr.triply.cc/Kadaster/cbs/def/inwoners65+",
      "https://krr.triply.cc/Kadaster/cbs/def/kinderdagverblijfAfstand",
      "https://krr.triply.cc/Kadaster/cbs/def/mannen",
      "https://krr.triply.cc/Kadaster/cbs/def/mannen-procent",
      "https://krr.triply.cc/Kadaster/cbs/def/meergezinswoningen",
      "https://krr.triply.cc/Kadaster/cbs/def/motortweewielers",
      "https://krr.triply.cc/Kadaster/cbs/def/ongehuwd",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakte",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakteLand",
      "https://krr.triply.cc/Kadaster/cbs/def/oppervlakteWater",
      "https://krr.triply.cc/Kadaster/cbs/def/personenautos0-5",
      "https://krr.triply.cc/Kadaster/cbs/def/personenautos6+",
      "https://krr.triply.cc/Kadaster/cbs/def/treinstation",
      "https://krr.triply.cc/Kadaster/cbs/def/vrouwen",
      "https://krr.triply.cc/Kadaster/cbs/def/vrouwen-procent",
      "https://krr.triply.cc/Kadaster/cbs/def/woz"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph graph:cbs-2015 {
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
