import * as React from "react";
// const Icon = require('-!svg-react-loader?name=Icon!./provinces.svg');
if (__CLIENT__) {
  const rawSvg = require('./provinces.raw.svg')
  console.log({rawSvg})
}
import * as _ from "lodash";
import * as getClassName from "classnames";
namespace FacetMultiSelect {
  export interface Option {
    value: string;
    checked:boolean
  }
  export interface Props {
    options: Option[];
    onChange: (value:string, checked:boolean) => any
  }
}
const styles = require("./style.scss");

class FacetMultiSelect extends React.PureComponent<FacetMultiSelect.Props, any> {
  render() {
    // console.log(Icon)
    return <div>
          {
        // this.props.options.map(o => <Checkbox
        //   label={o.label}
        //   checked={o.checked}
        //   key={o.value}
        //   onChange={(checked:boolean) => {
        //     this.props.onChange(o.value, checked)
        //   }}
        //   />)
        }
    </div>
  }
}
export default FacetMultiSelect;
