import {ClassConfig} from 'facetConfUtils'
const CLASSES: { [className: string]: ClassConfig } = {
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true, //default
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: ["https://cultureelerfgoed.nl/vocab/province", "http://schema.org/dateCreated", "http://dbpedia.org/ontology/code"],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?x ?y.
        <${iri}> brt:lijnGeometrie ?brtGeo .
        ?brtGeo geo:asWKT ?wkt.
        <${iri}> geo:hasGeometry ?geo .
        ?geo geo:asWKT ?wkt.
        ?y rdfs:label ?yLabel .
        <${iri}> foaf:depiction ?img .
        ?img ?imgX ?imgY .
        <${iri}> foaf:depiction ?depiction .
        ?depiction ?depictionX ?depictionY .
      `;
      var selectPattern = `
      <${iri}> ?x ?y.
      OPTIONAL {
        ?y rdfs:label ?yLabel
      }
      OPTIONAL {
        ?x rdfs:label ?xLabel
      }
      OPTIONAL {
        ?img foaf:depicts <${iri}> .
        OPTIONAL {?img ?imgX ?imgY}
      }
      OPTIONAL {
        <${iri}> geo:hasGeometry ?geo .
        ?geo geo:asWKT ?wkt.
      }

      `;
      return `CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `;
    }
  },
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false, //default
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: [
      // "https://cultureelerfgoed.nl/vocab/province",
      "https://data.pdok.nl/cbs/vocab/stedelijkheid",
      "https://data.pdok.nl/cbs/vocab/bedrijfsvestigingen",
      "https://data.pdok.nl/cbs/vocab/huisartsenpraktijkAfstand",
      "https://data.pdok.nl/cbs/vocab/woz",
      "https://data.pdok.nl/cbs/vocab/inwoners",
      "https://data.pdok.nl/cbs/vocab/personenautos6+"
    ],
    resourceDescriptionQuery: function(iri: string) {
      var projectPattern = `
        <${iri}> ?x ?y.
        <${iri}> brt:lijnGeometrie ?brtGeo .
        ?brtGeo geo:asWKT ?wkt.
        <${iri}> geo:hasGeometry ?geo .
        ?geo geo:asWKT ?wkt.
        ?y rdfs:label ?yLabel .

      `;
      var selectPattern = `
      GRAPH <https://data.pdok.nl/cbs/id/graph/2015> {
          <${iri}> ?x ?y.
          OPTIONAL {
            ?y rdfs:label ?yLabel
          }
          OPTIONAL {
            ?x rdfs:label ?xLabel
          }

          OPTIONAL {
            <${iri}> geo:hasGeometry ?geo .
            ?geo geo:asWKT ?wkt.
          }
        }

      `;
      return `CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `;
    }
  }
};
export default CLASSES
