import * as React from "react";

import getClassName from "classnames";
import SparqlJson from "../../helpers/SparqlJson";
import SparqlBuilder from "../../helpers/SparqlBuilder";
import { Facet as FacetProps, setSelectedSearchString } from "../../reducers/facets";
import { FacetMultiSelect, FacetSlider, FacetProvinces, FacetSearch } from "../";
import { setSelectedFacetValue, setSelectedObject } from "../../reducers/facets";
import { FACETS, getDereferenceableLink } from "../../facetConf";
import { FacetTypes } from "../../facetConfUtils";
import {Label} from '../'
declare namespace Facet {
  //Hacky interface so we can define a static function in an interface
  export interface FacetComponent {
    new (props?: Facet.Props): React.PureComponent<Facet.Props, any>;
    shouldRender(props: Facet.Props): boolean;
    getOptionsForQueryResult(sparql: SparqlJson): FacetProps["optionObject"] | FacetProps["optionList"];
    prepareOptionsQuery(sparqlBuilder: SparqlBuilder): SparqlBuilder;
  }
  export interface Props {
    className?: string;
    label: string;
    facet: FacetProps;
    setSelectedFacetValue: typeof setSelectedFacetValue;
    setSelectedObject: typeof setSelectedObject;
    setSelectedSearchString: typeof setSelectedSearchString;
  }
}
import * as styles from "./style.module.scss"

class Facet extends React.PureComponent<Facet.Props, any> {
  FacetComponents: Array<Facet.FacetComponent>;
  //used by subcomponents, so we can have an 'implements' interface that has static methods
  static staticImplements<T>() {
    return (_constructor: T) => {};
  }
  static getFacetFromString(key: FacetTypes) {
    switch (key) {
      case "multiselect":
        return FacetMultiSelect;
      case "slider":
        return FacetSlider;
      case "nlProvinces":
        return FacetProvinces;
      case "search":
        return FacetSearch;
      default:
        throw new Error("Unrecognized facet type " + key);
    }
  }
  constructor(props: Facet.Props) {
    super(props);
    this.FacetComponents = [FacetMultiSelect, FacetSlider, FacetProvinces, FacetSearch];
  }

  componentDidCatch(e: Error) {
    console.error("DID CATCH", e);
    return <div>ERRR</div>;
  }
  getLabel() {
    let label;
    if (FACETS[this.props.facet.iri] && FACETS[this.props.facet.iri].label) {
      label = FACETS[this.props.facet.iri].label;
    } else {
      label = this.props.label;
    }
    if(getDereferenceableLink(this.props.facet.iri)){
      return <a href={getDereferenceableLink(this.props.facet.iri)} target="_blank" rel="noopener noreferrer">{label}</a>
    }
    return label
  }
  renderError(msg:string) {
    return <Label message={msg} severity="error"/>
  }

  getFacet() {
    if (this.props.facet.error) return this.renderError(this.props.facet.error)
    if (!this.props.facet) return this.renderError("No facet info found in props")
    if (!this.props.facet.iri) return this.renderError("No iri found for facet config " + JSON.stringify(this.props))
    if (!FACETS[this.props.facet.iri]) return this.renderError("No facet configuration found for " + this.props.facet.iri)

    for (const FacetComponent of this.FacetComponents) {
      if (FacetComponent.shouldRender(this.props)) return <FacetComponent {...this.props} />;
    }

  }
  render() {
    const { className } = this.props;
    const facet = this.getFacet();

    if (facet) {
      return (
        <div className={getClassName(className)}>
          <div className={styles.facetHeader}>{this.getLabel()}</div>
          {facet}
        </div>
      );
    }
  }
}
export default Facet;
