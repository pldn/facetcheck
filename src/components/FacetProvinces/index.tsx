import * as React from "react";
import {Facet as GenericFacetProps} from 'reducers/facets'
import {FacetValue,FACETS} from 'facetConf'
var provincesSvg = '';
if (__CLIENT__) {
  provincesSvg = require('./provinces.raw.svg')
}
import SparqlJson from 'helpers/SparqlJson'
import { Facet } from "components";
const SVGInline = require("react-svg-inline").default;
import * as _ from "lodash";
import * as getClassName from "classnames";
import SparqlBuilder from 'helpers/SparqlBuilder'
namespace FacetProvinces {
  //Interface that extends the generic selectedObject from the facet reducer
  export type OptionObject = {[P in Provinces]: FacetValue | any}
  export interface FacetProps extends GenericFacetProps {
    optionObject: OptionObject
  }
  export interface Props extends Facet.Props {
    facet: FacetProps
  }

  export type Provinces = "limburg" | "zeeland" | "n-brabant" | "gelderland" | "z-holland" | "n-holland" | "utrecht" | "flevoland" | "overijssel" | "drenthe" | "groningen" | "friesland"
}
const styles = require("./style.scss");

@Facet.staticImplements<Facet.FacetComponent>()
class FacetProvinces extends React.PureComponent<FacetProvinces.Props, any> {
  static shouldRender(props:Facet.Props) {
    return FACETS[props.facet.iri].facetType === 'nlProvinces'
  }
  static prepareOptionsQuery(sparqlBuilder:SparqlBuilder) {
    return sparqlBuilder.limit(1);
  }
  static getOptionsForQueryResult(sparql:SparqlJson):FacetProvinces.OptionObject {
    const bindings = sparql.getValues();
    if (bindings.length === 0) return;
    const binding = bindings[0];
    function getOption(province:FacetProvinces.Provinces):FacetValue {
      const key = '_' + province;
      if (!binding[key]) throw new Error('Could not find value for ' + province + ' in sparql result set');
      return {
        ...binding[key],
        label: binding[key + 'Label']? binding[key+'Label'].value : undefined
      }
    }
    return {
      limburg: getOption('limburg'),
      drenthe: getOption('drenthe'),
      flevoland: getOption('flevoland'),
      friesland: getOption('friesland'),
      gelderland: getOption('gelderland'),
      groningen: getOption('groningen'),
      overijssel: getOption('overijssel'),
      utrecht: getOption('utrecht'),
      zeeland: getOption('zeeland'),
      'n-holland': getOption('n-holland'),
      'z-holland': getOption('z-holland'),
      'n-brabant': getOption('n-brabant')
    }
  }
  render() {
    const {facet} = this.props;
    return <div>
          {
            <SVGInline className={styles.provinces} svg={provincesSvg} onClick={(data:any,e:any) => {
              if (data.target && data.target.id) {
                const id:FacetProvinces.Provinces = data.target.id;
                if (this.props.facet.optionObject[id]) {
                  const val = facet.optionObject[id].value
                  this.props.setSelectedFacetValue(facet.iri, val, !facet.selectedFacetValues.has(val))
                }
              }
            }}/>
        }
    </div>
  }
}
export default FacetProvinces;
