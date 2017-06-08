import * as React from 'react';

import * as _ from 'lodash'
import * as getClassName from 'classnames';
import Checkbox from 'material-ui/Checkbox';
import {Shape} from 'redux/modules/schema'
import {getLabel, State as LabelsState} from 'redux/modules/labels'
import {FacetFilter,setFacetFilter, FacetFilterValue} from 'redux/modules/facets'
import * as moment from 'moment'
// import {OverlayTrigger, Tooltip} from 'react-bootstrap'
// import {Row,Col} from 'react-bootstrap';
// import {Link} from 'react-router'
import {
  FacetMultiSelect,
  FacetDate
} from 'components'
module Facet {
  export interface Props  {
    className?:string
    shape:Shape,
    label:string,
    labels?:LabelsState
    filter: FacetFilter,
    disabled?:boolean
    setFacetFilter: typeof setFacetFilter,
    // updateQuery:Function
  }
}
const styles = require('./style.scss');
const panelStyles = require('../../containers/Panel/style.scss');
class Facet extends React.PureComponent<Facet.Props,any> {
  getHeader() {
    return <div className={panelStyles.sectionHeader}>
      <a href={this.props.shape.predicate} target="_blank">{this.props.label}</a>
    </div>
  }
  render() {
    const {label,shape, className,filter,disabled,labels} = this.props;
    const enabledStyles = {
      [className]: !!className,
      [styles.facet]: !!styles.facet,
      [styles.disabled]: disabled,
      [panelStyles.section]: !!panelStyles.section,
      [panelStyles.firstSection]: !!panelStyles.firstSection
    }
    switch (shape.facetType) {
      case 'boolean':
        const activeValuesBoolean:{[val:string]:boolean} = {};
        if (filter) filter.values.forEach(val => {activeValues[val.value] = true})
        return <div className={getClassName(enabledStyles)}>
          {this.getHeader()}
          <FacetMultiSelect
            forShape={shape}
            options={[{value: 'true', label: 'Ja'}, {value:'false', label:'Nee'}]}
            activeValues={activeValuesBoolean}
            onChange={(selected) => {
              const selectedVals:FacetFilterValue[] = [];
              for (var value in selected) {
                if (selected[value]) selectedVals.push({value});
              }
              this.props.setFacetFilter(this.props.shape.predicate, {
                datatype: shape.rangeDatatype,
                values: selectedVals,
                isLiteral: true,
              })
            }}/>
        </div>
      case 'date':
        return <div className={getClassName(enabledStyles)}>
          {this.getHeader()}
          <FacetDate
          filter={filter}
          shape={shape}
          setFacetFilter={this.props.setFacetFilter}
          onMinDateChange={(e,date)=> {
            this.props.setFacetFilter(this.props.shape.predicate, _.merge<FacetFilter,FacetFilter,FacetFilter>({}as any, filter, {isLiteral: true, datatype:shape.rangeDatatype, greaterThan: moment(date).format("YYYY-MM-DD")}))
          }}
          onMaxDateChange={(e,date)=> {
            this.props.setFacetFilter(this.props.shape.predicate, _.merge<FacetFilter,FacetFilter,FacetFilter>({} as any, filter, {isLiteral: true, datatype:shape.rangeDatatype, lessThan: moment(date).format("YYYY-MM-DD")}))
          }}
          />
        </div>
      case 'nominal':
        const activeValues:{[val:string]:boolean} = {};
        if (filter) filter.values.forEach(val => {activeValues[val.value] = true})
        return <div className={getClassName(enabledStyles)}>
          {this.getHeader()}
          <FacetMultiSelect

            forShape={shape}
            options={shape.distinctValues.map(val => {
              return {
                value:val,
                label: (shape.nodeKind && shape.nodeKind === 'http://www.w3.org/ns/shacl#IRI'?getLabel(labels, val):val),
                link:  shape.nodeKind === 'http://www.w3.org/ns/shacl#IRI'? val: null
              }
            })}
            activeValues={activeValues}
            onChange={(selected) => {
              const selectedVals:FacetFilterValue[] = [];
              for (var value in selected) {
                if (selected[value]) selectedVals.push({value});
              }
              this.props.setFacetFilter(this.props.shape.predicate, {
                datatype: shape.rangeDatatype,
                values: selectedVals,
                isLiteral: shape.nodeKind === 'http://www.w3.org/ns/shacl#Literal'
              })
            }}/>
        </div>
      default:
        return null;

    }
  }
}
export default Facet
