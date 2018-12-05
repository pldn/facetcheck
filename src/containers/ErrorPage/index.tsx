//external dependencies
import * as React from "react";

import { Helmet } from "react-helmet";

//import own dependencies
import { Svg, FlexContainer } from "../../components";

import * as styles from "./style.module.scss";
var icon = require("./sad.svg");
class ErrorPage extends React.PureComponent<ErrorPage.Props, any> {
  render() {
    const { message, title } = this.props;
    return (
      <FlexContainer className={styles.container}>
        <Helmet title={title || "Not found"} />
        <div className={styles.iconRow}>
          <div>
            <h2>Oops!</h2>
            <p>{message || "The page you're looking for does not exist"}</p>
          </div>
          <div style={{flexGrow:1}}>
            <Svg src={icon} className={styles.icon} />
          </div>
        </div>
      </FlexContainer>
    );
  }
}
declare namespace ErrorPage {
  export interface Props {
    message: string;
    title: string;
  }
}
export default ErrorPage;
