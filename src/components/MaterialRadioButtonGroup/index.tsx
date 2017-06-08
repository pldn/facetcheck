//external dependencies
import * as React from 'react';

import * as ReduxForm from 'redux-form';
import { RadioButtonGroupProps} from 'material-ui'
// import  from 'material-ui/RadioButton'
import {RadioButtonGroup, RadioButton} from 'material-ui/RadioButton'
import * as _ from 'lodash'
//import own dependencies
import {
  // FormField
} from 'components'


const styles = require('./style.scss')


class MaterialRadioButtonGroup extends React.PureComponent<MaterialRadioButtonGroup.Props & ReduxForm.WrappedFieldProps<any>,MaterialRadioButtonGroup.State> {
  static RadioButton = RadioButton;

  adjustOwnProps():RadioButtonGroupProps{
    //map redux props to material-ui props
    const props:any = _.assign<RadioButtonGroupProps>({}, this.props);

    props.input.valueSelected = this.props.input.value;
    _.assign(props, props.input);
    return _.omit<RadioButtonGroupProps,RadioButtonGroupProps>(props, ['input', 'meta', 'custom'])
  }

  render() {
    return <div className={styles.checkbox}>
          <RadioButtonGroup
          {...this.adjustOwnProps()}
          style={{
            fontSize:'inherit'
          }}
          />
       </div>
  }
}
module MaterialRadioButtonGroup {

  export class Field extends ReduxForm.Field<Props & RadioButtonGroupProps> {}
  export interface Props extends RadioButtonGroupProps{

    //'custom' field are our own prop extensions to the text field props
    //putting this in a separate key, so we can easily remove it when passing it on to the textfield
    custom?: {
      // checkedOnDisabled?:boolean
    }
    component:typeof React.Component
  }
  export interface State {}
}
export default MaterialRadioButtonGroup;
