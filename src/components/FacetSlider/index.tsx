import * as React from "react";

import * as _ from "lodash";
// import * as getClassName from "classnames";
import {Facet} from 'components'
import {Facet as GenericFacetProps} from 'reducers/facets'
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
namespace FacetSlider {
  //Interface that extends the generic selectedObject from the facet reducer
  export interface Options {
    min?: number,
    max?:number
    [key:string]:number
  }
  export interface FacetProps extends GenericFacetProps {
    selectedObject: Options
  }
  export interface Props extends Facet.Props {
    facetProps: FacetProps
  }
}
const styles = require("./style.scss");
@Facet.staticImplements<Facet.FacetComponent>()
class FacetSlider extends React.PureComponent<FacetSlider.Props, any> {

  static shouldRender(props:Facet.Props) {
    return true;
  }
  render() {
    const {facetProps} = this.props
    const {min,max} = facetProps.selectedObject;
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
            this.props.setSelectedObject(facetProps.iri, selectedObject);
          }
        }}
      />
    </div>
  }
}
export default FacetSlider;
