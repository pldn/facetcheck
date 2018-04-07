//external dependencies
import * as React from "react";

import { TermLiteral } from "../";

const numeric = [
  "http://www.w3.org/2001/XMLSchema#decimal",
  "http://www.w3.org/2001/XMLSchema#integer",
  "http://www.w3.org/2001/XMLSchema#nonPositiveInteger",
  "http://www.w3.org/2001/XMLSchema#long",
  "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
  "http://www.w3.org/2001/XMLSchema#negativeInteger",
  "http://www.w3.org/2001/XMLSchema#int",
  "http://www.w3.org/2001/XMLSchema#unsignedLong",
  "http://www.w3.org/2001/XMLSchema#positiveInteger",
  "http://www.w3.org/2001/XMLSchema#short",
  "http://www.w3.org/2001/XMLSchema#unsignedInt",
  "http://www.w3.org/2001/XMLSchema#byte",
  "http://www.w3.org/2001/XMLSchema#unsignedShort",
  "http://www.w3.org/2001/XMLSchema#unsignedByte"
];

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export /* this statement implements both normal interface & static interface */
class TermLiteralNumeric extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return numeric.indexOf(props.value.getTerm().datatype) >= 0;
  }
  static WidgetName:TermLiteral.WidgetIdentifiers = 'LiteralNumeric'
  render() {
    const {  className } = this.props;
    const term = this.props.value.getTerm()
    return (
      <div className={className} title={term.value}>
        {term.value.replace(/^([+-]?)(\d*)(\.?)(\d*)$/, function(match, p1, p2, p3, p4) {
          return (
            (p1 === "-" ? "-" : "") + (p2.replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0") + (p3 === "." ? "," : "") + p4
          );
        })}
      </div>
    );
  }
}
export default TermLiteralNumeric;
