import * as _ from 'lodash'
var prefixes = {
  "amco": "http://www.gemeentegeschiedenis.nl/amco/",
  "begrip": "http://brt.basisregistraties.overheid.nl/id/begrip/",
  "brt": "http://brt.basisregistraties.overheid.nl/def/top10nl#",
  "brt-graph": "https://krr.triply.cc/LaurensRietveld/brt/graphs/",
  "buurt": "https://triply.cc/cbs/id/buurt/",
  "capital": "https://iisg.amsterdam/resource/capital/",
  "cbs": "https://triply.cc/cbs/def/",
  "cbs-code": "http://www.gemeentegeschiedenis.nl/cbscode/",
  "cbs-graph": "https://triply.cc/cbs/graph/",
  "complex": "https://cultureelerfgoed.nl/id/complex/",
  "country": "https://iisg.amsterdam/resource/country/",
  "dct": "http://purl.org/dc/terms/",
  "departement": "http://www.gemeentegeschiedenis.nl/departement/",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "functioneel-gebied": "http://brt.basisregistraties.overheid.nl/top10nl/id/functioneelgebied/",
  "gemeente": "https://triply.cc/cbs/id/gemeente/",
  "gemeente-naam": "http://www.gemeentegeschiedenis.nl/gemeentenaam/",
  "geo": "http://www.opengis.net/ont/geosparql#",
  "geometry": "http://brt.basisregistraties.overheid.nl/top10nl/id/geometry/",
  "gg": "http://www.gemeentegeschiedenis.nl/gg-schema#",
  "image": "https://cultureelerfgoed.nl/id/image/",
  "inrichtingselement": "http://brt.basisregistraties.overheid.nl/top10nl/id/inrichtingselement/",
  "monument": "https://cultureelerfgoed.nl/id/monument/",
  "pdok": "http://data.pdok.nl/def/pdok#",
  "provincie": "http://www.gemeentegeschiedenis.nl/provincie/",
  "rce": "https://cultureelerfgoed.nl/vocab/",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "registratief-gebied": "http://brt.basisregistraties.overheid.nl/top10nl/id/registratiefgebied/",
  "vcard": "http://www.w3.org/2006/vcard/ns#",
  "wegdeel": "http://brt.basisregistraties.overheid.nl/top10nl/id/wegdeel/",
  "wijk": "https://triply.cc/cbs/id/wijk/",
  "xsd": "http://www.w3.org/2001/XMLSchema#"
}

export default prefixes;

export function prefix(pref:keyof typeof prefixes, localName:string) {
  return prefixes[pref] + localName;
}
export function getAsString() {
  return _.reduce<any,string>(prefixes, function(result,val:string,key:string){
    return result += `PREFIX ${key}: <${val}>` + '\n'
  }, '')
}
