//external dependencies
import * as React from "react";
import * as getClassName from "classnames";

import * as styles from "./style.scss";

export namespace Ellipsis {
  export interface Props {
    value: string;
  }
  export interface State {
    showAll: boolean;
  }
}

export class Ellipsis extends React.PureComponent<Ellipsis.Props, Ellipsis.State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showAll: false
    };
  }
  showAll() {
    this.setState({ showAll: true });
  }
  render() {
    const value = this.props.value;
    const size = 17;
    if (this.state.showAll || value.length < 3 * size)
      return (
        <span>
          {value}
        </span>
      );
    return (
      <span>
        {value.substr(0, size)}{" "}
        <span
          onClick={this.showAll.bind(this)}
          className={getClassName(styles.dots, "btn-link")}
        >
          ......
        </span>{" "}
        {value.substr(-size)}
      </span>
    );
  }
}
export default Ellipsis;
