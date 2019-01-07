import _FACETS from "./config/facets";
import _CLASSES from "./config/classes";
import _CONFIG from "./config/config";

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
  return CONFIG.favIcon || "https://demo.triply.cc/imgs/logos/logo.png?v=0"
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

export function getPrefixes() {
  return CONFIG.prefixes;
}
