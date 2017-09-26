import * as React from "react";

import Checkbox from 'react-toolbox/lib/checkbox';
import {Facet} from 'components'
import {FACETS} from 'facetConf'
namespace FacetMultiSelect {

}
const styles = require("./style.scss");

@Facet.staticImplements<Facet.FacetComponent>()
class FacetMultiSelect extends React.PureComponent<Facet.Props, any> {
  static shouldRender(props: Facet.Props) {
    return FACETS[props.facet.iri].facetType === 'multiselect'
  }
  render() {
    return <div>
      {
        this.props.facet.optionList.map(o => <Checkbox
          label={o.label}
          checked={this.props.facet.selectedFacetValues.has(o.value)}
          key={o.value}
          onChange={(checked:boolean) => {
            this.props.setSelectedFacetValue(this.props.facet.iri, o.value, checked)
          }}
          />)
        }
    </div>
  }
}
export default FacetMultiSelect;
