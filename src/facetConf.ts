import _FACETS from "./config/facets";
import _CLASSES from "./config/classes";
import _CONFIG from "./config/config";
import { FacetConfig, ClassConfig, GlobalConfig } from "./facetConfUtils";
import { staticPrefixes } from "./prefixes";
export var FACETS = _FACETS;
export var CLASSES = _CLASSES;
export var CONFIG = _CONFIG;

export function getFacetcheckTitle() {
  return CONFIG.title || "Facetcheck";
}

export function getLogo() {
  return CONFIG.logo || require("./containers/Nav/kadaster.svg");
}
export function getFavIcon() {
  return CONFIG.favIcon 
}
export function getPageSize() {
  return CONFIG.pageSize || 5;
}

export function getDereferenceableLink(link: string) {
  if (CONFIG.getDereferenceableLink) {
    return CONFIG.getDereferenceableLink(link);
  }
  return undefined;
}
export function getMap() {
  return _CONFIG.geoMap || "osm"
}

var prefixes: GlobalConfig["prefixes"];
export function getPrefixes() {
  // export function getPrefixes(conf: GlobalConfig) {
  if (!prefixes) prefixes = { ...CONFIG.prefixes, ...staticPrefixes };
  return prefixes;
}
