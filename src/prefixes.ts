import * as _ from 'lodash'
var prefixes = {
  "bgt": "http://bgt.basisregistraties.overheid.nl/def/bgt#",
"brt": "http://brt.basisregistraties.overheid.nl/def/top10nl#",
"dct": "http://purl.org/dc/terms/",
"foaf": "http://xmlns.com/foaf/0.1/",
"geo": "http://www.opengis.net/ont/geosparql#",
"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
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
