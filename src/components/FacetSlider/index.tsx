import * as React from "react";

import * as _ from "lodash";
// import * as getClassName from "classnames";
import { Facet } from "../";
import { Facet as GenericFacetProps } from "../../reducers/facets";
import { FACETS } from "../../facetConf";
import { FacetValue } from "../../facetConfUtils";
import * as numeral from "numeral";
const Slider = require("rc-slider");
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import { default as SparqlJson, Term } from "../../helpers/SparqlJson";
import SparqlBuilder from "../../helpers/SparqlBuilder";
require("numeral/locales/nl-nl");
numeral.locale("nl-nl");
namespace FacetSlider {
  //Interface that extends the generic selectedObject from the facet reducer
  export interface Options {
    min?: any;
    max?: any;
    minLabel?: any;
    maxLabel?: any;
    isDate?: any;
    [key: string]: number;
  }
  export interface State {
    isDate: boolean;
  }
  export interface FacetProps extends GenericFacetProps {
    selectedObject: Options;
    optionObject: Options;
  }
  export interface Props extends Facet.Props {
    facet: FacetProps;
  }
}
const styles = require("./style.scss");
@Facet.staticImplements<Facet.FacetComponent>()
class FacetSlider extends React.PureComponent<FacetSlider.Props, FacetSlider.State> {
  static shouldRender(props: Facet.Props) {
    return FACETS[props.facet.iri].facetType === "slider";
  }
  static prepareOptionsQuery(sparqlBuilder: SparqlBuilder) {
    return sparqlBuilder.limit(1);
  }
  static valueToNumber(term: Term): { value: number; type: "date" | "number" } {
    if (
      term.datatype === "http://www.w3.org/2001/XMLSchema#dateTime" ||
      term.datatype === "http://www.w3.org/2001/XMLSchema#date"
    ) {
      // console.log(term.value.substr(0, 10).split('-').join('')
      return { value: Date.parse(term.value).valueOf(), type: "date" };
      // return +term.value.substr(0, 10).split('-').join('')
    }
    return { type: "number", value: +term.value };
  }
  static dateToString(d: Date) {
    function pad(n: number) {
      return n < 10 ? "0" + n : n;
    }
    var dash = "-";
    // var colon=":"
    return d.getFullYear() + dash + pad(d.getMonth() + 1) + dash + pad(d.getDate());
    // pad(d.getHours())+colon+
    // pad(d.getMinutes())+colon+
    // pad(d.getSeconds())
  }
  static numberToXsdDate(value: number): Partial<Term> {
    return {
      value: FacetSlider.dateToString(new Date(value)),
      type: "typed-literal",
      datatype: "http://www.w3.org/2001/XMLSchema#date"
    };
  }

  static getOptionsForQueryResult(sparql: SparqlJson): FacetSlider.Options {
    var minValue: number;
    var maxValue: number;
    var minValueLabel: any;
    var maxValueLabel: any;
    var isDate = false;
    const result = sparql.getValues();
    for (const binding of result) {
      if (binding._min) {
        const info = FacetSlider.valueToNumber(binding._min);
        minValue = info.value;
        if (!isDate && info.type === "date") isDate = true;
      }
      if (binding._max) {
        const info = FacetSlider.valueToNumber(binding._max);
        maxValue = info.value;
        if (!isDate && info.type === "date") isDate = true;
      }
      if (binding._minLabel) minValueLabel = binding._minLabel.value;
      if (binding._maxLabel) maxValueLabel = binding._maxLabel.value;
      if (isDate) {
        if (!minValueLabel) minValueLabel = FacetSlider.numberToXsdDate(minValue).value;
        if (!maxValueLabel) maxValueLabel = FacetSlider.numberToXsdDate(maxValue).value;
      }
    }
    return {
      min: minValue,
      max: maxValue,
      minLabel: minValueLabel || minValue,
      maxLabel: maxValueLabel || maxValue,
      isDate: isDate as any
    };
  }
  componentWillMount() {
    if (this.props.facet && this.props.facet.optionObject && this.props.facet.optionObject.isDate) {
      this.setState({ isDate: true });
    }
  }
  render() {
    const { facet } = this.props;
    if (!facet.optionObject) return null;
    var { min, max, maxLabel, minLabel } = facet.optionObject;

    if (!_.isFinite(min)) {
      console.warn(`Invalid minimum value for slider of ${facet.iri} (${min}). Assuming min val 0`);
      min = 0;
    }
    if (!_.isFinite(max)) {
      throw new Error(
        "Trying to render a slider for prop " + facet.iri + ", but no maximum value is given: max " + max
      );
    }
    var stepSize = 1;
    if (!_.isInteger(min) || !_.isInteger(max)) {
      stepSize = 0.1;
    }
    // console.log(facet.selectedObject)
    return (
      <div className={styles.range}>
        <Range
          min={min}
          max={max}
          defaultValue={[min, max]}
          step={stepSize}
          tipFormatter={(value: number) => {
            // return 'bla'
            if (this.state && this.state.isDate) return FacetSlider.numberToXsdDate(value).value;
            return value;
          }}
          marks={{
            //TODO: see how we can use numeral, AND use this for dates as well
            // [min]: numeral(min).format('0,0'),
            // [max]: numeral(max).format('0,0')
            [min]: minLabel,
            [max]: maxLabel
          }}
          // value={[min,max]}
          onAfterChange={(values: number[]) => {
            const [selectedMin, selectedMax] = values;
            var selectedObject: FacetSlider.Options = {};
            //only set min/max when its different that the outer bounds (otherwise no use in including it in our query)
            selectedObject.min = min !== selectedMin ? selectedMin : null;
            selectedObject.max = min !== selectedMax ? selectedMax : null;

            //one caveat: _do_ set min/max when they are at its bounds, and are the same (otherwise, the filter wont apply)
            if (selectedMin === selectedMax) {
              selectedObject = { min: selectedMin, max: selectedMax };
            }
            //do some further conversion
            if (this.state && this.state.isDate) {
              if (selectedObject.min) selectedObject.min = FacetSlider.numberToXsdDate(selectedObject.min);
              if (selectedObject.max) selectedObject.max = FacetSlider.numberToXsdDate(selectedObject.max);
            }

            this.props.setSelectedObject(facet.iri, selectedObject);
          }}
        />
      </div>
    );
  }
}
export default FacetSlider;
