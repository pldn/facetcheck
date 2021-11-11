import * as React from "react";

import * as _ from "lodash";
// import getClassName from "classnames";
import { Facet, TermLiteralNumeric } from "../";
import { Facet as GenericFacetProps } from "../../reducers/facets";
import { FACETS } from "../../facetConf";
import { SparqlTerm as Term } from "../../facetConfUtils";
import * as numeral from "numeral";
const Slider = require("rc-slider");
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import { default as SparqlJson } from "../../helpers/SparqlJson";
import SparqlBuilder from "../../helpers/SparqlBuilder";
require("numeral/locales/nl-nl");
numeral.locale("nl-nl");
declare namespace FacetSlider {
  //Interface that extends the generic selectedObject from the facet reducer
  export interface Options {
    min?: any;
    max?: any;
    minLabel?: any;
    maxLabel?: any;
    isDate?: any;
    isNumber?: any;
    [key: string]: number;
  }
  export interface State {
    isDate: boolean;
    isNumber: boolean;
  }
  export interface FacetProps extends GenericFacetProps {
    selectedObject: Options;
    optionObject: Options;
  }
  export interface Props extends Facet.Props {
    facet: FacetProps;
  }
}
import * as styles from "./style.module.scss"

@Facet.staticImplements<Facet.FacetComponent>()
class FacetSlider extends React.PureComponent<FacetSlider.Props, FacetSlider.State> {
  static shouldRender(props: Facet.Props) {
    return FACETS[props.facet.iri].facetType === "slider";
  }
  static prepareOptionsQuery(sparqlBuilder: SparqlBuilder) {
    return sparqlBuilder.limit(1);
  }
  static parseTerm(term: Term): { value: number; type: "date" | "number" | "other"; label?: string } {
    if (
      term.datatype === "http://www.w3.org/2001/XMLSchema#dateTime" ||
      term.datatype === "http://www.w3.org/2001/XMLSchema#date"
    ) {
      // console.log(term.value.substr(0, 10).split('-').join('')
      return { value: Date.parse(term.value).valueOf(), type: "date" };
      // return +term.value.substr(0, 10).split('-').join('')
    }
    if(TermLiteralNumeric.isNumeric(term.datatype)) {
      return {
        type: "number",
        value: +term.value,
        label: TermLiteralNumeric.formatNumber(term.value)
      };
    }
    return { type: "other", value: +term.value };
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
    let minValue: number;
    let maxValue: number;
    let minValueLabel: any;
    let maxValueLabel: any;
    let isDate = false;
    let isNumber = false;

    const result = sparql.getValues();
    for (const binding of result) {
      if (binding._min) {
        const info = FacetSlider.parseTerm(binding._min);
        minValue = info.value;
        if (info.label) minValueLabel = info.label;
        if (info.type === "date") isDate = true;
        if (info.type === "number") isNumber = true;
      }
      if (binding._max) {
        const info = FacetSlider.parseTerm(binding._max);
        maxValue = info.value;
        if (info.label) maxValueLabel = info.label;
        if (info.type === "date") isDate = true;
        if (info.type === "number") isNumber = true;
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
      isDate: isDate as any,
      isNumber: isNumber as any
    };
  }
  componentWillMount() {
    if (this.props.facet && this.props.facet.optionObject && this.props.facet.optionObject.isDate) {
      this.setState({ isDate: true });
    }
    if (this.props.facet && this.props.facet.optionObject && this.props.facet.optionObject.isNumber) {
      this.setState({ isNumber: true });
    }
  }
  tipFormatter = (value: number) => {
    // return 'bla'
    if (this.state && this.state.isDate) return FacetSlider.numberToXsdDate(value).value;
    if (this.state && this.state.isNumber) return TermLiteralNumeric.formatNumber(value.toString());
    return value;
  }
  onAfterChange = (values: number[]) => {
    const { facet } = this.props;
    var { min} = facet.optionObject;
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
          tipFormatter={this.tipFormatter}
          marks={{
            //TODO: see how we can use numeral, AND use this for dates as well
            // [min]: numeral(min).format('0,0'),
            // [max]: numeral(max).format('0,0')
            [min]: minLabel,
            [max]: maxLabel
          }}
          // value={[min,max]}
          onAfterChange={this.onAfterChange}
        />
      </div>
    );
  }
}
export default FacetSlider;
