//external dependencies
import * as React from "react";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
import { Navbar } from "react-bootstrap";

//import own dependencies
import { HamburgerBtn,  Notifications, Svg } from "../../components";
import { Panel } from "../../containers";
import { toggleDsPanelCollapseLg } from "../../reducers/app";
import { StateInterface, removeNotification } from "../../reducers/notifications";
import { RouteComponentProps } from "../../containers";
import * as reactRouterRedux from "react-router-redux";
import { GlobalState } from "../../reducers";
import {getLogo} from '../../facetConf'

export interface IAppProps extends RouteComponentProps {
  logout?: Function;
  notifications: StateInterface;
  removeNotification?: typeof removeNotification;
  toggleDsPanelCollapseLg?: typeof toggleDsPanelCollapseLg;
  pushState?: Function;
}

const styles = require("./style.scss");
const mapStateToProps = (state: GlobalState): IAppProps =>
  ({
    notifications: state.notifications
  } as IAppProps);

const mapDispatchToProps: MapDispatchToPropsObject = {
  pushState: reactRouterRedux.push,
  removeNotification: removeNotification,
  toggleDsPanelCollapseLg
};

@(connect as any)(mapStateToProps, mapDispatchToProps)
export default //had to modify the typescript definition of the connect function to return ClassDecorator.
//otherwise, you're not able to extend the component with any other properties than defined in the component class
class App extends React.PureComponent<IAppProps, any> {
  goToMainPage = () => {
    this.props.pushState("/");
  }

  render() {
    const {  notifications, removeNotification } = this.props;

    const enabledStyles = {
      [styles.app]: true
    };

    return (
      <div className={getClassName(enabledStyles)}>
        <Navbar fixedTop fluid bsStyle={null} className={styles.navbar}>
          <Navbar.Header>
            <div className={styles.brandWrapper + " hidden-xs"}>
              <Svg src={getLogo()} onClick={this.goToMainPage} className={styles.kadasterSvg} />
            </div>
            <HamburgerBtn
              onClick={this.props.toggleDsPanelCollapseLg}
              className={"visible-xs"}
              title={"Toggle Navigation"}
            />
          </Navbar.Header>
        </Navbar>
        <Notifications closeHandler={removeNotification} notifications={notifications} />
        <Panel/>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <div className={styles.overlay} onClick={this.props.toggleDsPanelCollapseLg} />
      </div>
    );
  }
}
