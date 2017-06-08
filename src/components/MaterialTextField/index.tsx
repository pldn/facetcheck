//external dependencies
import * as React from 'react';
// import * as ReactDOM from 'react-dom';

import * as ReduxForm from 'redux-form';
import { Tooltip, Overlay,TooltipProps} from 'react-bootstrap'
import { TextFieldProps} from 'material-ui'
import TextField from 'material-ui/TextField'

import * as _ from 'lodash'
//import own dependencies
import {
  // FormField
} from 'components'




class TooltipWrapper extends React.PureComponent<TooltipProps,any> {
  render() {
    return <Tooltip {...this.props} style={{
      //offset for floating label
      top:this.props.positionTop + 13,
      //set fixed width. Could not get dynamic width working well
      width: 200
    }}/>
  }
}


class MaterialTextField extends React.PureComponent<MaterialTextField.Props & ReduxForm.WrappedFieldProps,MaterialTextField.State> {
  field:any
  fieldWrapper:any

  getOverlay() {
    if (this.props.custom && this.props.custom.overlayText && this.field) {
      return <Overlay
          show={this.props.meta.active}
          placement="right"
          container={this.fieldWrapper}
          target={() => this.field}
        >
            <TooltipWrapper id="overlayTooltip">
              <div>{this.props.custom.overlayText}</div>
            </TooltipWrapper>
        </Overlay>
    } else {
      return null;
    }
  }

  getFloatingLabelStyle(extraStyle:React.CSSProperties = {}) {
    return _.assign({
      fontWeight: 400,
      left: (this.props.custom && this.props.custom.leftIcon?30:0)
    }, extraStyle)
  }

  getInputStyle(extraStyle:React.CSSProperties = {}) {
    const style:React.CSSProperties = {

    }
    if (this.props.custom && this.props.custom.leftIcon) {
      style.display = 'block';
      style.paddingLeft = 30;
    }
    if (this.props.custom && this.props.custom.rightIcon) {
      style.display = 'block';
      style.paddingRight=38;
    }

    return _.assign(style, extraStyle);
  }
  adjustOwnProps():TextFieldProps {
    const props = _.assign<TextFieldProps>({}, this.props, this.props.input);
    if (this.props.meta.touched && this.props.meta.error) props.errorText = this.props.meta.error;
    //If no ID is set, then the material lib uses math.random to create one
    //this won't work with server side rendering, as the server generated html is different
    //than the client-side html
    //so, set one ourselves if needed
    //TODO: prepend the name with the name of the form to make it more specific
    if (!props.id) props.id = props.name;
    return _.omit(props, ['input', 'meta', 'custom'])
  }

  getHintStyle(extraStyle:React.CSSProperties = {}) {
    return _.assign({
      fontWeight: 400,
      left: (this.props.custom && this.props.custom.leftIcon?30:0)
    }, extraStyle)
  }

  //can be either left or right aligned
  getBaseIconStyle(extraStyle:React.CSSProperties = {}) {
    return _.assign({
      position: 'absolute',
      top: 6,
      right: 0,
      zIndex: 2,
      display: 'block',
      width: 30,
      height: '35px',
      lineHeight: '35px',
      textAlign: 'center',
      pointerEvents: 'none',
    }, extraStyle)
  }
  getLeftIcon(extraStyle:React.CSSProperties = {}) {
    const style:React.CSSProperties = {
      left: 0
    }
    if (this.props.floatingLabelText) {
      style.top = 31
    }
    if (this.props.meta.active) {
      if (this.props.meta.touched && this.props.meta.error) {
        style.color = 'rgb(244, 67, 54)';
      } else {
        style.color = 'rgb(22, 144, 198)';
      }
    }
    if (this.props.custom && this.props.custom.leftIcon) return <i
      style={this.getBaseIconStyle(_.assign(style, extraStyle))}
      className={'fa ' + this.props.custom.leftIcon}
    />
    return null;
  }
  getRightIcon(extraStyle:React.CSSProperties = {}) {
    const style:React.CSSProperties = {
      right: 0
    }
    if (this.props.floatingLabelText) {
      style.top = 31
    }
    if (this.props.custom && this.props.custom.rightIconClickHandler) {
      style.pointerEvents = 'auto'
      style.cursor = 'pointer'
      style.color = 'rgb(22, 144, 198)'
    }
    if (this.props.custom && this.props.custom.rightIcon) return <i
      style={this.getBaseIconStyle(_.assign(style, extraStyle))}
      className={'fa ' + this.props.custom.rightIcon}
      onClick={this.props.custom.rightIconClickHandler || function() {}}
    />
    return null;
  }
  getGroupStyle() {
    const style:React.CSSProperties = {
      //otherwise the width of div would be 100%, and alignment of possible left icon would look strange
      //so only use block when width is explicitly full width
      display: this.props.fullWidth?'block':'inline-block'
    }
    if (this.props.custom && (this.props.custom.leftIcon || this.props.custom.rightIcon)) {
      style.position = 'relative'
    }
    return style;
  }
  render() {
    return <div>{/**wrap in div. the group style is set as inline block to avoid width100% issues and
      misaligned icons. Need another div wrapper, to avoid having fields that
      are aligned side-by-side though**/}
        <div ref={(el) => {this.fieldWrapper = el}} style={this.getGroupStyle()}>
          <TextField
          {...this.adjustOwnProps()}
          style={{
            fontSize:'inherit',
            marginBottom: 14//adjust for margin on input element. If we're not doing
            //this, then the input element can overflow on e.g. a button, making
            //it partially not clickable (see requireddetailspage submit button)
          }}
          inputStyle={this.getInputStyle()}
          hintStyle={this.getHintStyle()}
          floatingLabelStyle={this.getFloatingLabelStyle()}
          ref={(el) => {this.field = el}}
          />
          {this.getOverlay()}
          {this.getLeftIcon()}
          {this.getRightIcon()}
         </div>
       </div>
  }
}
module MaterialTextField {

  export class Field extends ReduxForm.Field<Props & TextFieldProps> {}
  export interface Props extends TextFieldProps{
    //'custom' field are our own prop extensions to the text field props
    //putting this in a separate key, so we can easily remove it when passing it on to the textfield
    custom?: {
      overlayText?:string
      leftIcon?:string
      rightIcon?:string
      rightIconClickHandler?:React.MouseEventHandler
    }
    component:typeof React.Component
  }
  export interface State {}
}
export default MaterialTextField;
