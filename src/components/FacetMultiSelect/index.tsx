import * as React from 'react';

import * as _ from 'lodash'
import * as getClassName from 'classnames';
import Checkbox from 'material-ui/Checkbox';
import {setActiveClasses} from 'redux/modules/facets'
import {Shape} from 'redux/modules/schema'
// import {OverlayTrigger, Tooltip} from 'react-bootstrap'
// import {Row,Col} from 'react-bootstrap';
// import {Link} from 'react-router'

module FacetMultiSelect {
  export interface Option {
    value: string,
    label: string,
    link?:string,
    count?:number
  }
  export interface Props  {
    forShape: Shape
    options: Option[]
    label?: string,
    longLabel?: string,
    className?:string,
    activeValues: {[value:string]:boolean},
    onChange:typeof setActiveClasses,
  }
}
const styles = require('./style.scss');

class FacetMultiSelect extends React.PureComponent<FacetMultiSelect.Props,any> {
  updateFacets(value:string, checked:boolean) {
    const activeValues = _.clone(this.props.activeValues);
    activeValues[value] = checked;
    this.props.onChange(activeValues)
  }
  render() {
    const {label, longLabel, className,options,activeValues} = this.props;
    const enabledStyles = {
      [className]: !!className,
      [styles.multiSelect]: !!styles.multiSelect
    }
    return (
      <div className={getClassName(enabledStyles)}>
          {options.map(option => {
            // const debugging = ['Waterdeel', 'Wegdeel'].indexOf(option.label) >= 0;
            const getLabel = () => {
              const count = option.count && <span className={styles.counter}> ({option.count})</span>
              const label = (option.link?
                <a href={option.link} target="_blank">{option.label}</a>
                :
                <span>{option.label}</span>
              )
              return <div> {label} {count}</div>
            }
            return <div className={getClassName({
              [styles.option]: !!styles.option,
              [styles.hasLink]: !!option.link
            })}
              key={(this.props.forShape?this.props.forShape.predicate:'x') + option.value}
            >
              <Checkbox

                label={getLabel() as any}
                value={option.value}
                checked={!!activeValues[option.value]}
                onCheck={(el, checked) => {this.updateFacets(option.value, checked)}}
                iconStyle={{marginRight:5}}
              />
            </div>

          })
          }
      </div>
    );
  }
}
export default FacetMultiSelect
