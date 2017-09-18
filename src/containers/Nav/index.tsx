//external dependencies
import * as React from "react";
import { connect, MapDispatchToPropsObject } from "react-redux";
// import {ActionCreator} from 'redux';
import { asyncConnect, IAsyncConnect } from "redux-connect";
// import { LinkContainer} from 'react-router-bootstrap';
import { Link } from "react-router";
import * as getClassName from "classnames";
import { Navbar, Button } from "react-bootstrap";

//import own dependencies
// import {IConfig} from 'reducers/config'
import { HamburgerBtn, NavIcon, Notifications, Svg } from "components";
import { Panel } from "containers";
// import {getCurrentUrl} from 'staticConfig'
import { toggleDsPanelCollapseLg } from "reducers/app";
import { StateInterface, removeNotification } from "reducers/notifications";
import { RouteComponentProps } from "containers";
import * as reactRouterRedux from "react-router-redux";
import { GlobalState } from "reducers";
import { setRootClassname } from "reducers/app";

export interface IAppProps extends RouteComponentProps {
  logout?: Function;
  notifications: StateInterface;
  removeNotification?: typeof removeNotification;
  toggleDsPanelCollapseLg?: typeof toggleDsPanelCollapseLg;
  // panelToggled?:boolean,
  // panelCollapsed?:boolean,
  // currentUrl?:string,
  pushState?: Function;
  // appConfig?:IConfig
}
const kadasterSvg = require("./kadaster.svg");
const styles = require("./style.scss");
const mapStateToProps = (state: GlobalState): IAppProps =>
  ({
    // appConfig: state.config.config,
    notifications: state.notifications
    // panelToggled: state.app.panelToggled,
    // panelCollapsed: state.app.panelCollapsed,
    // currentUrl: getCurrentUrl(state.config.config,state.routing.locationBeforeTransitions.pathname, state.routing.locationBeforeTransitions.search)
  } as IAppProps);

const mapDispatchToProps: MapDispatchToPropsObject = {
  pushState: reactRouterRedux.push,
  removeNotification: removeNotification,
  toggleDsPanelCollapseLg
};

@asyncConnect([
  {
    promise: ({ store: { dispatch, getState } }) => {
      var promises: any = [];
      var state: GlobalState = getState();
      if (state.app.className !== "console") promises.push(dispatch(setRootClassname("console")));
      return Promise.all(promises);
    }
  } as IAsyncConnect<any>
])
@(connect as any)(mapStateToProps, mapDispatchToProps)
export default //had to modify the typescript definition of the connect function to return ClassDecorator.
//otherwise, you're not able to extend the component with any other properties than defined in the component class
class App extends React.PureComponent<IAppProps, any> {
  goToMainPage() {
    this.props.pushState("/");
  }

  render() {
    const { params, notifications, removeNotification } = this.props;
    const accountLink = "/" + params.account;

    const enabledStyles = {
      // 'collapsed': panelCollapsed,
      // 'toggled': panelToggled,
      [styles.app]: true
    };

    return (
      <div className={getClassName(enabledStyles)}>
        <Navbar fixedTop fluid bsStyle={null} className={styles.navbar}>
          <Navbar.Header>
            <div className={styles.brandWrapper + " hidden-xs"}>
              <Svg src={kadasterSvg} onClick={this.goToMainPage.bind(this)} className={styles.kadasterSvg} />
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
