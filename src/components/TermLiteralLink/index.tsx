//external dependencies
import * as React from "react";
import * as url from "url";

import { TermLiteral, TermLiteralDefault } from "components";

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
class TermLiteralLink extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return props.term.datatype === "http://www.w3.org/2001/XMLSchema#anyURI";
  }
  render() {
    const { term, className } = this.props;
    const parsed = url.parse(term.value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? <div className={className}>
          <a href={term.value} target="_blank">
            {term.value}
          </a>
        </div>
      : <TermLiteralDefault {...this.props} />;
  }
}
export default TermLiteralLink;
