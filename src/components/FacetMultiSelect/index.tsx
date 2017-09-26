import * as React from "react";

import Checkbox from 'react-toolbox/lib/checkbox';
import {Facet} from 'components'
import {FACETS,FacetValue} from 'facetConf'
import SparqlJson from 'helpers/SparqlJson'
import SparqlBuilder from 'helpers/SparqlBuilder'
namespace FacetMultiSelect {

}
const styles = require("./style.scss");

@Facet.staticImplements<Facet.FacetComponent>()
class FacetMultiSelect extends React.PureComponent<Facet.Props, any> {
  static shouldRender(props: Facet.Props) {
    return FACETS[props.facet.iri].facetType === 'multiselect'
  }
  static getOptionsForQueryResult(sparql:SparqlJson) {
    const values: FacetValue[] = [];
    const result = sparql.getValues();
    for (const binding of result) {
      if (binding._value) {
        values.push({
          ...binding._value,
          label: binding._valueLabel ? binding._valueLabel.value : undefined
        });
      }
    }
    return values
  }
  static prepareOptionsQuery(sparqlBuilder:SparqlBuilder) {
    return sparqlBuilder.limit(100);
  }
  render() {
    if (!this.props.facet.optionList) return null;
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
