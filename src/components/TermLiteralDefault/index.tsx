//external dependencies
import * as React from "react";

import { TermLiteral, Ellipsis } from "components";

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
class TermLiteralDefault extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return true;
  }
  render() {
    const { value, className } = this.props;
    return (
      <div className={className}>
        <Ellipsis value={value} />
      </div>
    );
  }
}
export default TermLiteralDefault;
