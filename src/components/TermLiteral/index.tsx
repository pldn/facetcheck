//external dependencies
import * as React from "react";

import * as N3 from "n3";
import * as getClassName from "classnames";
//import own dependencies
import { TermLiteralBoolean } from "components";

export namespace TermLiteral {
  export interface Props {
    className?: string;
    value: string;
    showDatatype?: boolean;
    showLanguage?: boolean;
    datatype?: string;
    language?: string;
  }
}

const styles = require("./style.scss");
//used for e.g. IRIs and graphnames
class TermLiteral extends React.PureComponent<TermLiteral.Props, any> {
  static acceptsTerm(term: string, context: N3.Statement[]) {
    return N3.Util.isLiteral(term) || N3.Util.isBlank(term);
  }
  render() {
    const { showDatatype, showLanguage, className, value, datatype, language } = this.props;
    var useClass = getClassName(styles.literal, className);
    switch (datatype) {
      case "http://www.w3.org/2001/XMLSchema#boolean":
        return <TermLiteralBoolean className={useClass} value={value} />;
      default:
        return (
          <div className={useClass}>
            <span>
              {value}
            </span>
            {showDatatype &&
              !language &&
              <sup>
                {"^^<" + datatype + ">"}
              </sup>}
            {showLanguage &&
              language &&
              <span>
                @{language}
              </span>}
          </div>
        );
    }
  }
}
export default TermLiteral;
