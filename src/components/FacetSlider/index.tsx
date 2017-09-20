import * as React from "react";

import * as _ from "lodash";
import * as getClassName from "classnames";
const Slider = require('rc-slider');
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
    return <Slider.default min={min} max={max}/>
    // return <div>
    //   {
    //     this.props.options.map(o => <Checkbox
    //       label={o.label}
    //       checked={o.checked}
    //       key={o.value}
    //       onChange={(checked:boolean) => {
    //         this.props.onChange(o.value, checked)
    //       }}
    //       />)
    //     }
    // </div>
  }
  // updateFacets(value: string, checked: boolean) {
  //   const activeValues = _.clone(this.props.activeValues);
  //   activeValues[value] = checked;
  //   // this.props.onChange(activeValues)
  // }
  // render() {
  //   const { label, longLabel, className, options, activeValues } = this.props;
  //   const enabledStyles = {
  //     [className]: !!className,
  //     [styles.multiSelect]: !!styles.multiSelect
  //   };
  //   return (
  //     <div className={getClassName(enabledStyles)}>
  //       {options.map(option => {
  //         // const debugging = ['Waterdeel', 'Wegdeel'].indexOf(option.label) >= 0;
  //         const getLabel = () => {
  //           const count =
  //             option.count &&
  //             <span className={styles.counter}>
  //               {" "}({option.count})
  //             </span>;
  //           const label = option.link
  //             ? <a href={option.link} target="_blank">
  //                 {option.label}
  //               </a>
  //             : <span>
  //                 {option.label}
  //               </span>;
  //           return (
  //             <div>
  //               {" "}{label} {count}
  //             </div>
  //           );
  //         };
  //         return (
  //           <div
  //             className={getClassName({
  //               [styles.option]: !!styles.option,
  //               [styles.hasLink]: !!option.link
  //             })}
  //             // key={(this.props.forShape?this.props.forShape.predicate:'x') + option.value}
  //           >
  //             <Checkbox
  //               label={getLabel() as any}
  //               value={option.value}
  //               checked={!!activeValues[option.value]}
  //               // onCheck={(el, checked) => {this.updateFacets(option.value, checked)}}
  //               iconStyle={{ marginRight: 5 }}
  //             />
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }
}
export default FacetSlider;
