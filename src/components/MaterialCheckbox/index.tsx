//external dependencies
import * as React from 'react';

import * as ReduxForm from 'redux-form';
import { CheckboxProps} from 'material-ui'
import Checkbox from 'material-ui/Checkbox'

import * as _ from 'lodash'
//import own dependencies
import {
  // FormField
} from 'components'


const styles = require('./style.scss')


class MaterialCheckbox extends React.PureComponent<MaterialCheckbox.Props & ReduxForm.WrappedFieldProps,MaterialCheckbox.State> {

  adjustOwnProps():CheckboxProps {
    //map redux props to material-ui props
    const props = _.assign<CheckboxProps>({}, this.props, _.omit(this.props.input, ['onChange', 'value']));

    props.checked = (this.props.input.value ?true:false)
    if (this.props.custom && this.props.custom.checkedOnDisabled && this.props.disabled) {
      props.checked = true;
    }
    props.onCheck = this.props.input.onChange;
    //If no ID is set, then the material lib uses math.random to create one
    //this won't work with server side rendering, as the server generated html is different
    //than the client-side html
    //so, set one ourselves if needed
    //TODO: prepend the name with the name of the form to make it more specific
    if (!props.id) props.id = props.name;
    return _.omit(props, ['input', 'meta', 'custom'])
  }

  render() {
    // const {meta:{pristine}, input:{value}} = this.props;
    return <div className={styles.checkbox}>
          <Checkbox
          {...this.adjustOwnProps()}
          style={{
            fontSize:'inherit'
          }}
          />
       </div>
  }
}
module MaterialCheckbox {

  export class Field extends ReduxForm.Field<Props & CheckboxProps> {}
  export interface Props extends CheckboxProps{

    //'custom' field are our own prop extensions to the text field props
    //putting this in a separate key, so we can easily remove it when passing it on to the textfield
    custom?: {
      checkedOnDisabled?:boolean
    }
    component:typeof React.Component
  }
  export interface State {}
}
export default MaterialCheckbox;
