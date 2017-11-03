import * as _ from 'lodash'
var prefixes = {
  brt: 'http://brt.basisregistraties.overheid.nl/def/top10nl#',
  cbs: 'https://data.pdok.nl/cbs/vocab/',
  dct: 'http://purl.org/dc/terms/',
  foaf: 'http://xmlns.com/foaf/0.1/',
  graph: 'https://data.pdok.nl/cbs/graph/',
  rce: 'https://cultureelerfgoed.nl/vocab/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  geo: 'http://www.opengis.net/ont/geosparql#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
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
