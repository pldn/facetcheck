import * as _ from "lodash";
import { GlobalConfig } from "./facetConfUtils";
import {Util } from 'n3'

export function prefix(prefixes: GlobalConfig["prefixes"], pref: keyof typeof prefixes, localName: string) {
  return prefixes[pref] + localName;
}
export function getAsString(prefixes: GlobalConfig["prefixes"]) {
  return _.reduce<any, string>(
    prefixes,
    function(result, val: string, key: string) {
      return (result += `PREFIX ${key}: <${val}>` + "\n");
    },
    ""
  );
}

export const staticPrefixes = {
  dct: Util.prefix("http://purl.org/dc/terms/"),
  foaf: Util.prefix("http://xmlns.com/foaf/0.1/"),
  geo: Util.prefix("http://www.opengis.net/ont/geosparql#"),
  rdf: Util.prefix("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
  rdfs: Util.prefix("http://www.w3.org/2000/01/rdf-schema#"),
};
