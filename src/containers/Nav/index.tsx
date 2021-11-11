//external dependencies
import * as React from "react";
import { connect } from "react-redux";
import getClassName from "classnames";
import { Button } from "react-toolbox/lib/button";

//import own dependencies
import {  Notifications, Svg } from "../../components";
import { Panel } from "../../containers";
import { StateInterface, removeNotification } from "../../reducers/notifications";
import { GlobalState } from "../../reducers";
import {getLogo} from '../../facetConf'
import globalConfig from '../../config/config';

export interface IAppProps {
  logout?: Function;
  notifications?: StateInterface;
  removeNotification?: typeof removeNotification;
  pushState?: Function;
  statements?:GlobalState['statements']
}

import * as styles from "./style.module.scss"
import { downloadCsv } from "../../helpers/Csv";
const mapStateToProps = (state: GlobalState): IAppProps =>
  ({
    notifications: state.notifications,
    statements:state.statements
  } as IAppProps);


@(connect as any)(mapStateToProps, {
  removeNotification: removeNotification
})
export default //had to modify the typescript definition of the connect function to return ClassDecorator.
//otherwise, you're not able to extend the component with any other properties than defined in the component class
class Navbar extends React.PureComponent<IAppProps, any> {

  download = () => {
    downloadCsv(
      // get the list of statements from the state
      this.props.statements.resourceDescriptions.toSeq().toArray(),
      // use the page title from the config as a basis for filename
      globalConfig.title
    );
  }

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
          <Button className={styles.downloadButton} onClick={this.download}>Download csv</Button>
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
