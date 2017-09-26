import * as React from "react";

import Checkbox from 'react-toolbox/lib/checkbox';
import {Facet} from 'components'
namespace FacetMultiSelect {

}
const styles = require("./style.scss");

@Facet.staticImplements<Facet.FacetComponent>()
class FacetMultiSelect extends React.PureComponent<Facet.Props, any> {
  static shouldRender(props: Facet.Props) {
    return false;
  }
  render() {
    return <div>
      {
        this.props.facetProps.optionList.map(o => <Checkbox
          label={o.label}
          checked={this.props.facetProps.selectedFacetValues.has(o.value)}
          key={o.value}
          onChange={(checked:boolean) => {
            this.props.setSelectedFacetValue(this.props.facetProps.iri, o.value, checked)
          }}
          />)
        }
    </div>
  }
}
export default FacetMultiSelect;
