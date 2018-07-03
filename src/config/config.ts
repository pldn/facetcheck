import { GlobalConfig } from "@triply/facetcheck/build/src/facetConfUtils";
const conf: GlobalConfig = {
  endpoint: {
    token: "",
    url: "https://betalinkeddata.cbs.nl/sparql"
  },
  logo: "https://www.cbs.nl/Content/images/cbs-brand.svg",
  pageSize: 6,
  prefixes: {
    cbs: "http://betalinkeddata.cbs.nl/def/cbs#",
    "cbs-qb": "http://betalinkeddata.cbs.nl/def/cbs-qb#",
    code: "http://betalinkeddata.cbs.nl/83487NED/id/code/",
    def: "http://betalinkeddata.cbs.nl/def/83487NED#",
    dimension: "http://betalinkeddata.cbs.nl/def/dimension#",
    gemeente: "http://betalinkeddata.cbs.nl/regios/2016/id/gemeente-geografisch/",
    geo: "http://www.opengis.net/ont/geosparql#",
    qb: "http://purl.org/linked-data/cube#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    slice: "http://betalinkeddata.cbs.nl/83487NED/id/slice/",
    xsd: "http://www.w3.org/2001/XMLSchema#"
  },
  title: "👪 Bevolkings Browser"
};
export default conf;
