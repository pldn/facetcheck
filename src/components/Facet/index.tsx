import * as React from "react";


import * as getClassName from "classnames";


import {Facet as FacetProps} from 'reducers/facets'
import {FacetMultiSelect, FacetSlider, FacetProvinces} from 'components'
import {setSelectedFacetValue,setSelectedObject} from 'reducers/facets'
namespace Facet {
  //Hacky interface so we can define a static function in an interface
  export interface FacetComponent {
    new (props?: Facet.Props): React.PureComponent<Facet.Props, any>;
    shouldRender(props: Facet.Props): boolean;
  }
  export interface Props {
    className?:string,
    facet: FacetProps,
    setSelectedFacetValue: typeof setSelectedFacetValue,
    setSelectedObject: typeof setSelectedObject
  }
}
const styles = require("./style.scss");

class Facet extends React.PureComponent<Facet.Props, any> {
  FacetComponents: [Facet.FacetComponent];
  //used by subcomponents, so we can have an 'implements' interface that has static methods
  static staticImplements<T>() {
    return (constructor: T) => {};
  }
  constructor(props: Facet.Props) {
    super(props);
    this.FacetComponents = [
      FacetMultiSelect,
      FacetSlider,
      FacetProvinces
    ];

  }

  renderFacet() {
    for (const FacetComponent of this.FacetComponents) {
      if (FacetComponent.shouldRender(this.props)) return <FacetComponent {...this.props} />;
    }
    return null;
  }
  render() {
    const { className } = this.props;
    return (
      <div className={getClassName(className, styles.wrapper)}>
        {this.renderFacet()}
      </div>
    );
  }
}
export default Facet;
