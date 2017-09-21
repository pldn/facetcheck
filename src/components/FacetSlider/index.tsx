import * as React from "react";

import * as _ from "lodash";
// import * as getClassName from "classnames";
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
namespace FacetSlider {

  export interface Props {
    min: number,
    max: number,
    onChange: (min:number, max:number) => any
  }
}
const styles = require("./style.scss");
class FacetSlider extends React.PureComponent<FacetSlider.Props, any> {
  render() {
    const {min, max, onChange} = this.props
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
          const [min,max] = values;
          this.props.onChange(min,max);
        }}
      />
    </div>
  }
}
export default FacetSlider;
