import _FACETS from './config/facets'
import _CLASSES from './config/classes'
import _CONFIG from './config/config'
import {FacetConfig ,ClassConfig, GlobalConfig} from './facetConfUtils'
export var FACETS = _FACETS
export var CLASSES = _CLASSES
export var CONFIG = _CONFIG


export function getFacetcheckTitle() {
  return CONFIG.title || 'Facetcheck'
}

export function getLogo() {
  return CONFIG.logo || require('./containers/Nav/kadaster.svg')
}
