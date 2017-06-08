//external dependencies
import * as React from 'react';

import * as getClassName from 'classnames'
// import {Table,Button} from 'react-bootstrap';
//import own dependencies
// import { ITerm} from 'redux/modules/data'
export module TermBoolean {
  export interface Props {
    className?: string,
    value:string,
  }

}

const styles = require('./style.scss');
//used for e.g. IRIs and graphnames
class TermBoolean extends React.PureComponent<TermBoolean.Props,any> {
  render() {
    const {value,className} = this.props;
    const activeIconStyles = {
      fa: true,
      'fa-check': value === 'true',
      'fa-times': value !== 'true',
      [styles.icon]: !!styles.icon
    }
    return <div className={getClassName(styles.boolean,className)}>
        <i className={getClassName(activeIconStyles)}/>
      </div>
  }
}
export default TermBoolean
