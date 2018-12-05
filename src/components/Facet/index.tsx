import * as React from "react";

import * as getClassName from "classnames";
import SparqlJson from "../../helpers/SparqlJson";
import SparqlBuilder from "../../helpers/SparqlBuilder";
import { Facet as FacetProps } from "../../reducers/facets";
import { FacetMultiSelect, FacetSlider, FacetProvinces } from "../";
import { setSelectedFacetValue, setSelectedObject } from "../../reducers/facets";
import { FACETS, getDereferenceableLink } from "../../facetConf";
import { FacetTypes } from "../../facetConfUtils";

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
      default:
        throw new Error("Unrecognized facet type " + key);
    }
  }
  constructor(props: Facet.Props) {
    super(props);
    this.FacetComponents = [FacetMultiSelect, FacetSlider as any, FacetProvinces];
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
  render() {
    const { className } = this.props;
    var facet: any;
    if (this.props.facet.error) {
      // facet = <Label bsStyle="danger">{this.props.facet.error}</Label>;
      facet = <div>{this.props.facet.error}</div>;
    } else {
      for (const FacetComponent of this.FacetComponents) {
        if (FacetComponent.shouldRender(this.props)) facet = <FacetComponent {...this.props} />;
      }
      if (!FACETS[this.props.facet.iri]) {
        throw new Error("No facet configuration found for " + this.props.facet.iri);
      }
    }

    if (facet) {
      return (
        <div className={getClassName(className)}>
          <div className={styles.facetHeader}>{this.getLabel()}</div>
          {facet}
        </div>
      );
    }
    return null;
  }
}
export default Facet;
