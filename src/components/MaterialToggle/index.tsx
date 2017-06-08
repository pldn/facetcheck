//external dependencies
import * as React from 'react';
import {Label} from 'react-bootstrap'

import * as ReduxForm from 'redux-form';
import { ToggleProps} from 'material-ui'
import Toggle from 'material-ui/Toggle'

import * as _ from 'lodash'
//import own dependencies
import {
  // FormField
} from 'components'





class MaterialToggle extends React.PureComponent<MaterialToggle.Props & ReduxForm.WrappedFieldProps<any>,MaterialToggle.State> {

  adjustOwnProps():ToggleProps {
    //map redux props to material-ui props
    const props = _.assign<ToggleProps>({}, this.props, _.omit(this.props.input, ['onChange', 'value']));
    props.toggled = (this.props.input.value ?true:false)
    props.onToggle = this.props.input.onChange;
    //If no ID is set, then the material lib uses math.random to create one
    //this won't work with server side rendering, as the server generated html is different
    //than the client-side html
    //so, set one ourselves if needed
    //TODO: prepend the name with the name of the form to make it more specific
    if (!props.id) props.id = props.name;
    return _.omit(props, ['input', 'meta', 'custom'])
  }

  render() {
    const {meta:{pristine}, input:{value}} = this.props;
    var warning:string;
    if (this.props.custom && this.props.custom.warnOnChanged && !pristine) warning = this.props.custom.warnOnChanged(value);
    return <div>
          <Toggle
          {...this.adjustOwnProps()}
          style={{
            fontSize:'inherit'
          }}
          />
          {warning && <div style={{marginBottom:8}}><Label bsStyle="warning">{warning}</Label></div>}
       </div>
  }
}
module MaterialToggle {

  export class Field extends ReduxForm.Field<Props & ToggleProps> {}
  export interface Props extends ToggleProps{

    //'custom' field are our own prop extensions to the text field props
    //putting this in a separate key, so we can easily remove it when passing it on to the textfield
    custom?: {
      warnOnChanged?:(value:boolean) =>string
    }
    component:typeof React.Component
  }
  export interface State {}
}
export default MaterialToggle;
