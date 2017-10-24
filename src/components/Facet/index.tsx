import * as React from "react";

import * as getClassName from "classnames";
import {Label } from 'react-bootstrap'
import SparqlJson from "helpers/SparqlJson";
import SparqlBuilder from "helpers/SparqlBuilder";
import { Facet as FacetProps } from "reducers/facets";
import { FacetMultiSelect, FacetSlider, FacetProvinces } from "components";
import { setSelectedFacetValue, setSelectedObject } from "reducers/facets";
import {  FACETS } from "facetConf";
import { FacetTypes } from "facetConfUtils";
namespace Facet {
  //Hacky interface so we can define a static function in an interface
  export interface FacetComponent {
    new (props?: Facet.Props): React.PureComponent<Facet.Props, any>;
    shouldRender(props: Facet.Props): boolean;
    getOptionsForQueryResult(sparql: SparqlJson): FacetProps["optionObject"] | FacetProps["optionList"];
    prepareOptionsQuery(sparqlBuilder: SparqlBuilder): SparqlBuilder;
  }
  export interface Props {
    className?: string;
    label: string
    facet: FacetProps;
    setSelectedFacetValue: typeof setSelectedFacetValue;
    setSelectedObject: typeof setSelectedObject;
  }
}
const styles = require("./style.scss");

class Facet extends React.PureComponent<Facet.Props, any> {
  FacetComponents: [Facet.FacetComponent];
  //used by subcomponents, so we can have an 'implements' interface that has static methods
  static staticImplements<T>() {
    return (constructor: T) => {};
  }
  static getFacetFromString(key: FacetTypes) {
    switch (key) {
      case "multiselect":
        return FacetMultiSelect;
      case "slider":
        return FacetSlider;
      case "nlProvinces":
        return FacetProvinces;
      default:
        throw new Error("Unrecognized facet type " + key);
    }
  }
  constructor(props: Facet.Props) {
    super(props);
    this.FacetComponents = [FacetMultiSelect, FacetSlider, FacetProvinces];
  }


  render() {
    const { className,label } = this.props;
    var facet: any;
    if (this.props.facet.error) {
      facet = <Label bsStyle="danger">{this.props.facet.error}</Label>
    } else {
      for (const FacetComponent of this.FacetComponents) {
        if (FacetComponent.shouldRender(this.props)) facet = <FacetComponent {...this.props} />;
      }
    }
    if (facet) {
      return (
        <div className={getClassName(className)}>
          <div className={styles.facetHeader}>{FACETS[this.props.facet.iri].label || label}</div>
          {facet}
        </div>
      );
    }
    return null;
  }
}
export default Facet;
