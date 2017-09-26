import * as React from "react";
import {Facet as GenericFacetProps} from 'reducers/facets'
import {FacetValue,FACETS} from 'facetConf'
var provincesSvg = '';
if (__CLIENT__) {
  provincesSvg = require('./provinces.raw.svg')
}

import { Facet } from "components";
const SVGInline = require("react-svg-inline").default;
import * as _ from "lodash";
import * as getClassName from "classnames";
namespace FacetProvinces {
  //Interface that extends the generic selectedObject from the facet reducer
  export interface FacetProps extends GenericFacetProps {
    optionObject: {[P in Provinces]: FacetValue | any}
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
