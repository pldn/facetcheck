import {ClassConfig} from 'facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  "https://data.pdok.nl/cbs/vocab/Buurt": {
    default: true,
    iri: "https://data.pdok.nl/cbs/vocab/Buurt",
    label: "Buurt",
    facets: [
      "https://data.pdok.nl/cbs/vocab/jeugdzorgtrajecten_Perspectief_Diagnostiek_aantal_D_JeugdhulpMetVerblijf"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        <${iri}> ?p ?o
        optional { ?p rdfs:label ?pLabel }
        optional { ?o rdfs:label ?oLabel }
        optional {
          <${iri}> geo:hasGeometry ?geo .
          ?geo geo:asWKT ?wkt
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },/*
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false,
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: [
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand",
      "https://data.pdok.nl/cbs/vocab/woz",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/personenautos6+"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph <https://data.pdok.nl/cbs/graph/2015> {
          <${iri}> ?p ?o
          optional { ?p rdfs:label ?pLabel }
          optional { ?o rdfs:label ?oLabel }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },
  "https://data.pdok.nl/cbs/vocab/Wijk": {
    default: false,
    iri: "https://data.pdok.nl/cbs/vocab/Wijk",
    label: "Wijk",
    facets: [
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand",
      "https://data.pdok.nl/cbs/vocab/woz",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/personenautos6+"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?p ?o .
        ?geo geo:asWKT ?wkt .
        ?p rdfs:label ?pLabel .
        ?o rdfs:label ?oLabel .`;
      var selectPattern = `
        graph <https://data.pdok.nl/cbs/graph/2015> {
          <${iri}> ?p ?o
          optional { ?p rdfs:label ?pLabel }
          optional { ?o rdfs:label ?oLabel }
          optional {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt
          }
        }`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  },*/
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true,
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: [
      //"https://cultureelerfgoed.nl/vocab/provincie",
      "https://cultureelerfgoed.nl/vocab/bouwjaar"//,
      //"https://cultureelerfgoed.nl/vocab/monumentCode"
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
/*
  "https://cultureelerfgoed.nl/vocab/Complex": {
    default: true,
    iri: "https://cultureelerfgoed.nl/vocab/Complex",
    label: "Complex",
    facets: [
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> dct:hasPart ?monument .
        ?monument rdfs:label ?monumentLabel .`;
      var selectPattern = `
        ?monument dct:isPartOf <${iri}> ;
                  rdfs:label ?monumentLabel .`;
      return `construct { ${projectPattern} } { ${selectPattern} }`;
    }
  }
*/
};
export default CLASSES
