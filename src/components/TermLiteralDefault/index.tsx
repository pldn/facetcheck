//external dependencies
import * as React from "react";

import { TermLiteral, Ellipsis } from "components";

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
class TermLiteralDefault extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return true;
  }
  render() {
    const {  className } = this.props;
    const term = this.props.value.getTerm()
    return (
      <div className={className}>
        <Ellipsis value={term.value} />
      </div>
    );
  }
}
export default TermLiteralDefault;
