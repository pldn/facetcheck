import * as _ from 'lodash'
var prefixes = {
  "brt": "http://brt.basisregistraties.overheid.nl/def/top10nl#",
  "buurt": "https://triply.cc/cbs/id/buurt/",
  "cbs": "https://triply.cc/cbs/def/",
  "dct": "http://purl.org/dc/terms/",
  "foaf": "http://xmlns.com/foaf/0.1/",
  "geo": "http://www.opengis.net/ont/geosparql#",
  "graph": "https://krr.triply.cc/Kadaster/graph/",
  "rce": "https://cultureelerfgoed.nl/vocab/",
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
  "registratief-gebied": "http://brt.basisregistraties.overheid.nl/top10nl/id/registratiefgebied/",
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
