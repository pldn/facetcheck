//external dependencies
import * as React from "react";
import * as _ from "lodash";
import * as N3 from 'n3'
import { TermLiteral } from "components";
import * as styles from './style.scss'
@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export class TermLiteralTextarea extends React.PureComponent<TermLiteral.Props, any> {
  tags: { language: string; script: string; region: string; regionCode: string };

  constructor(props: TermLiteral.Props) {
    super(props);
  }
  static shouldRender(props: TermLiteral.Props) {
    return props.config && props.config.type === 'textarea';
  }


  render() {
    return (
      <div className={styles.textarea}>
      {this.props.term.value}
      </div>
    );
  }
}
export default TermLiteralTextarea;
