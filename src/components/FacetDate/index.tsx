import * as React from 'react';
import BaseComponent from 'helpers/BaseComponent'
import * as _ from 'lodash'
import * as getClassName from 'classnames';
import DatePicker from 'material-ui/DatePicker';
import {DatePickerProps} from 'material-ui'
import {setActiveClasses,FacetFilter,setFacetFilter} from 'redux/modules/facets'
import {Shape} from 'redux/modules/schema'
import * as moment from 'moment'
module FacetDate {
  export interface Props  {
    shape:Shape,
    className?:string,
    onMinDateChange?:(e:any, d:Date)=>void,
    onMaxDateChange?:(e:any, d:Date)=>void,
    filter:FacetFilter
    setFacetFilter:typeof setFacetFilter
  }
}
const styles = require('./style.scss');

class FacetDate extends BaseComponent<FacetDate.Props,any> {

  resetDate(whichDate: 'from'|'to') {
    if (whichDate === 'from') {
      const filter = _.clone(this.props.filter);
      delete filter.greaterThan;
      // this.props.setFacetFilter(this.props.shape.predicate, _.assign(this.props.filter, {greaterThan: null}))
      this.props.setFacetFilter(this.props.shape.predicate, filter)
    } else {
      const filter = _.clone(this.props.filter);
      delete filter.lessThan;
      this.props.setFacetFilter(this.props.shape.predicate, filter)
    }
  }
  render() {
    const {className,shape,filter} = this.props;
    const enabledStyles = {
      [className]: !!className,
      [styles.dateFacet]: !!styles.dateFacet
    }
    const datePickerProps:DatePickerProps = {
      textFieldStyle:{width: '100%'},
      style:{width:'100%'},
      inputStyle:{width:'100%'},
      fullWidth:true,
      container:"inline",
      mode:"landscape",
      className: styles.datePicker
    }
    return (
      <div className={getClassName(enabledStyles)}>
          <div className={styles.widgetContainer}>
            <i className={'fa fa-calendar'}/>
            <DatePicker

              id={shape.predicate + 'after'}
              minDate={new Date(shape.minValue)}
              //hmm, this seems to slow down the drawing of the page. No idea why....
              // maxDate={moment.min(moment(shape.maxValue), (this.props.filter && this.props.filter.lessThan && moment(this.props.filter.lessThan)) || moment(shape.maxValue)).toDate()}
              floatingLabelText="After"
              hintText="After"
              onChange={this.props.onMinDateChange}
              value={this.props.filter && this.props.filter.greaterThan && new Date(this.props.filter.greaterThan)}
              {...datePickerProps}
              />
            {filter && filter.greaterThan && <i className={'fa fa-times'} onClick={() => {this.resetDate('from')}}/>}
          </div>
          <div className={styles.widgetContainer}>
            <i className={'fa fa-calendar'}/>
            <DatePicker
            id={shape.predicate + 'before'}
            floatingLabelText="Before"
            hintText="Before"
            onChange={this.props.onMaxDateChange}
            //hmm, this seems to slow down the drawing of the page. No idea why....
            // minDate={moment.max(moment(shape.minValue), (this.props.filter && this.props.filter.greaterThan && moment(this.props.filter.greaterThan)) || moment(shape.minValue)).toDate()}
            maxDate={new Date(shape.maxValue)}
            value={this.props.filter && this.props.filter.lessThan && new Date(this.props.filter.lessThan)}
            {...datePickerProps}
            />
            {filter && filter.lessThan && <i className={'fa fa-times'} onClick={() => {this.resetDate('to')}}/>}
          </div>
      </div>
    );
  }
}
export default FacetDate
