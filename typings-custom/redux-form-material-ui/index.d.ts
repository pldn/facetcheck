// AutoComplete
// Checkbox
// DatePicker
// RadioButtonGroup
// SelectField
// Slider
// TextField
// TimePicker
// Toggle

declare module 'redux-form-material-ui' {
    import * as MaterialUi from 'material-ui';
    import * as ReduxForm from 'redux-form'
    // export module TextField {
    //   export class TextFieldComponent {
    //
    //   }
    // }
    export class TextField extends ReduxForm.Field<{}> {}
    export interface TextFieldProps extends MaterialUi.TextFieldProps{}
}
