//external dependencies
import * as React from "react";
import * as getClassName from "classnames";

//import own dependencies
import * as styles from "./style.module.scss";

declare namespace FlexContainer {
  export interface Props {
    className?: string;
    innerClassName?: string;
    style?: {};
    innerStyle?: {};
  }
}
class FlexContainer extends React.PureComponent<FlexContainer.Props, any> {
  render() {
    return (
      <div className={getClassName(styles.flex, this.props.className)} style={this.props.style}>
        <div className={styles.side} />
        <div className={getClassName(styles.container, this.props.innerClassName)} style={this.props.innerStyle}>
          {this.props.children}
        </div>
        <div className={styles.side} />
      </div>
    );
  }
}

export default FlexContainer;
