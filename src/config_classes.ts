import {ClassConfig} from 'facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  // cbs:Buurt
  "https://data.pdok.nl/cbs/vocab/Buurt": {
    default: true,
    iri: "https://data.pdok.nl/cbs/vocab/Buurt",
    label: "Buurt",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
      "https://data.pdok.nl/cbs/vocab/afstandCafé",
      "https://data.pdok.nl/cbs/vocab/attractieAfstand",
      "https://data.pdok.nl/cbs/vocab/personenautos6+",
      "https://data.pdok.nl/cbs/vocab/woz"
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
  },
  // cbs:Gemeente
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false,
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
      "https://data.pdok.nl/cbs/vocab/afstandCafé",
      "https://data.pdok.nl/cbs/vocab/attractieAfstand",
      "https://data.pdok.nl/cbs/vocab/personenautos6+",
      "https://data.pdok.nl/cbs/vocab/woz"
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
  },
  // cbs:Wijk
  "https://data.pdok.nl/cbs/vocab/Wijk": {
    default: false,
    iri: "https://data.pdok.nl/cbs/vocab/Wijk",
    label: "Wijk",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenA",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenBF",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenGI",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenHJ",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenKL",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenMN",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingenRU",
      "https://data.pdok.nl/cbs/vocab/afstandCafé",
      "https://data.pdok.nl/cbs/vocab/attractieAfstand",
      "https://data.pdok.nl/cbs/vocab/personenautos6+",
      "https://data.pdok.nl/cbs/vocab/woz"
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
  },
  // rce:Monument
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true,
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: [
      "https://cultureelerfgoed.nl/vocab/provincie",
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
