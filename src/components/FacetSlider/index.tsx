import * as React from "react";

import * as _ from "lodash";
// import * as getClassName from "classnames";
import {Facet} from 'components'
import {Facet as GenericFacetProps} from 'reducers/facets'
import {FACETS, FacetValue} from 'facetConf'
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import SparqlJson from 'helpers/SparqlJson'
import SparqlBuilder from 'helpers/SparqlBuilder'
namespace FacetSlider {
  //Interface that extends the generic selectedObject from the facet reducer
  export interface Options {
    min?: number,
    max?:number
    [key:string]:number
  }
  export interface FacetProps extends GenericFacetProps {
    selectedObject: Options,
    optionObject: Options
  }
  export interface Props extends Facet.Props {
    facet: FacetProps
  }
}
const styles = require("./style.scss");
@Facet.staticImplements<Facet.FacetComponent>()
class FacetSlider extends React.PureComponent<FacetSlider.Props, any> {

  static shouldRender(props:Facet.Props) {
    return FACETS[props.facet.iri].facetType === 'slider'
  }
  static prepareOptionsQuery(sparqlBuilder:SparqlBuilder) {
    return sparqlBuilder.limit(1);
  }
  static getOptionsForQueryResult(sparql:SparqlJson):FacetSlider.Options {
    var minValue: number;
    var maxValue: number;
    const result = sparql.getValues();
    for (const binding of result) {
      if (binding._min) minValue = +binding._min.value;
      if (binding._max) maxValue = +binding._max.value;
    }
    return {
      min: minValue,
      max: maxValue
    };
  }
  render() {
    const {facet} = this.props
    if (!facet.optionObject) return null
    const {min,max} = facet.optionObject;
    return <div className={styles.range}>
      <Range
        min={min}
        max={max}
        defaultValue={[min,max]}
        marks={{
          [min]: min,
          [max]:max
        }}
        // value={[min,max]}
        onAfterChange={(values:number[]) => {
          const [selectedMin,selectedMax] = values;
          const selectedObject:FacetSlider.Options = {};
          //only set min/max when its different that the outer bounds (otherwise no use in including it in our query)
          if (min !== selectedMin) selectedObject.min = selectedMin;
          if (max !== selectedMax) selectedObject.max = selectedMax;
          if (_.size(selectedObject)) {
            this.props.setSelectedObject(facet.iri, selectedObject);
          }
        }}
      />
    </div>
  }
}
export default FacetSlider;
