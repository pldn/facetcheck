//external dependencies
import * as React from "react";
import * as getClassName from "classnames";

import { TermLiteral, TermLiteralDefault } from "components";
import * as styles from "./style.scss";

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export /* this statement implements both normal interface & static interface */
class TermLiteralBoolean extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return props.term.datatype === "http://www.w3.org/2001/XMLSchema#boolean";
  }
  render() {
    switch (this.props.term.value) {
      case "true":
        return <i title="true" className={getClassName("fa fa-check", styles.boolean, styles.true)} />;
      case "false":
        return <i title="false" className={getClassName("fa fa-times", styles.boolean, styles.false)} />;
      default:
        return <TermLiteralDefault {...this.props} />;
    }
  }
}
export default TermLiteralBoolean;
