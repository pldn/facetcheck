import * as React from "react";
// const Icon = require('-!svg-react-loader?name=Icon!./provinces.svg');
var provincesSvg = '';
if (__CLIENT__) {
  provincesSvg = require('./provinces.raw.svg')
}
const SVGInline = require("react-svg-inline").default;
import * as _ from "lodash";
import * as getClassName from "classnames";
namespace FacetMultiSelect {
  export type Provinces = "limburg" | "zeeland" | "n-brabant" | "gelderland" | "z-holland" | "n-holland" | "utrecht" | "flevoland" | "overijssel" | "drenthe" | "groningen" | "friesland"
  export interface Option {
    value: string;
    checked:boolean
  }
  export interface Props {
    options: {
      [province:Provinces]: Option
    };
    onChange: (value:string, checked:boolean) => any
  }
}
const styles = require("./style.scss");

class FacetMultiSelect extends React.PureComponent<FacetMultiSelect.Props, any> {
  render() {
    return <div>
          {
            <SVGInline className={styles.provinces} svg={provincesSvg} onClick={(data:any,e:any) => {
              if (data.target && data.target.id) {
                // this.props.onChange()
              }
            }}/>
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
