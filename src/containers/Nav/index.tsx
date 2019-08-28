//external dependencies
import * as React from "react";
import { connect } from "react-redux";
import * as getClassName from "classnames";

//import own dependencies
import {  Notifications, Svg } from "../../components";
import { Panel } from "../../containers";
import { StateInterface, removeNotification } from "../../reducers/notifications";
import { GlobalState } from "../../reducers";
import {getLogo} from '../../facetConf'

export interface IAppProps {
  logout?: Function;
  notifications?: StateInterface;
  removeNotification?: typeof removeNotification;
  pushState?: Function;
}

import * as styles from "./style.module.scss"
const mapStateToProps = (state: GlobalState): IAppProps =>
  ({
    notifications: state.notifications
  } as IAppProps);


@(connect as any)(mapStateToProps, {
  removeNotification: removeNotification
})
export default //had to modify the typescript definition of the connect function to return ClassDecorator.
//otherwise, you're not able to extend the component with any other properties than defined in the component class
class App extends React.PureComponent<IAppProps, any> {
  render() {
    const {  notifications, removeNotification } = this.props;

    const enabledStyles = {
      [styles.app]: true
    };

    return (
      <div className={getClassName(enabledStyles)}>
        <div  className={styles.navbar}>
          <a href='/'>
          <Svg src={getLogo()} className={styles.logo} />
          </a>
        </div>
        <Notifications closeHandler={removeNotification} notifications={notifications} />
        <Panel/>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
