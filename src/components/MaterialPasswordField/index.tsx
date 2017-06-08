//external dependencies
import * as React from 'react';

import * as ReduxForm from 'redux-form';
import { TextFieldProps} from 'material-ui'
import * as _ from 'lodash'

//import own dependencies
import {
  MaterialTextField
} from 'components'



class MaterialPasswordField extends React.PureComponent<MaterialPasswordField.Props & ReduxForm.WrappedFieldProps,MaterialPasswordField.State> {
  field:any
  state:MaterialPasswordField.State =  {
    showPassword:false
  }
  toggleState() {
    this.setState({
      showPassword: !this.state.showPassword,
    })
  }
  render() {

    const customProps = this.props.custom;
    customProps.rightIcon=(this.state.showPassword?'fa-eye-slash':'fa-eye')
    customProps.rightIconClickHandler=this.toggleState.bind(this)

    const otherProps:any = _.omit(this.props as MaterialTextField.Props,'custom');

    return <MaterialTextField {...otherProps} custom={customProps} type={(this.state.showPassword? 'text': 'password')}/>
  }
}



module MaterialPasswordField {
  export class Field extends ReduxForm.Field<Props & TextFieldProps> {}
  export interface Props extends MaterialTextField.Props{}
  export interface State {
    showPassword?:boolean
  }
}
export default MaterialPasswordField;
