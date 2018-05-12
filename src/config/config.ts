import { GlobalConfig } from "@triply/facetcheck/build/src/facetConfUtils";

const conf: GlobalConfig = {
  endpoint: {
    url: "https://triply.eculture.labs.vu.nl/sparql",
    token: null
  },
  defaultClass: 'http://bgt.basisregistraties.overheid.nl/def/bgt#Pand',
  prefixes: {
    dct: "http://purl.org/dc/terms/",
    foaf: "http://xmlns.com/foaf/0.1/",
    geo: "http://www.opengis.net/ont/geosparql#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  }
};
export default conf;
