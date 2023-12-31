//external dependencies
import * as React from "react";
import * as url from "url";

import { TermLiteral, TermLiteralDefault } from "../";

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
class TermLiteralLink extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    const term = props.value.getTerm();
    return term.termType === "Literal" && term.datatypeString === "http://www.w3.org/2001/XMLSchema#anyURI";
  }
  static WidgetName:TermLiteral.WidgetIdentifiers = 'LiteralLink'
  render() {
    const {  className } = this.props;
    const term = this.props.value.getTerm()
    const parsed = url.parse(term.value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? <div className={className}>
          <a href={term.value} target="_blank" rel="noopener noreferrer">
            {term.value}
          </a>
        </div>
      : <TermLiteralDefault {...this.props} />;
  }
}
export default TermLiteralLink;
