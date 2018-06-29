import { GlobalConfig } from "@triply/facetcheck/build/src/facetConfUtils";
const conf: GlobalConfig = {
  endpoint: {
    token: null,
    url: "https://data.labs.pdok.nl/sparql"
  },
  logo: "https://demo.triply.cc/imgs/avatars/d/5af446ea41fcac027d4b3978.png?v=0",
  pageSize: 10,
  prefixes: {
    dbeerpedia: "http://dbeerpedia.com/def#",
    dct: "http://purl.org/dc/terms/",
    geo: "http://www.opengis.net/ont/geosparql#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "http://schema.org/",
    xsd: "http://www.w3.org/2001/XMLSchema#"
  },
  title: "🍺 Bier browserij"
};
export default conf;
