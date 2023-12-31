//external dependencies
import * as React from "react";
import * as _ from "lodash";
import { TermLiteral } from "../";
import * as styles from './style.module.scss'
@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export class TermLiteralTextarea extends React.PureComponent<TermLiteral.Props, any> {
  tags: { language: string; script: string; region: string; regionCode: string };

  constructor(props: TermLiteral.Props) {
    super(props);
  }
  static WidgetName:TermLiteral.WidgetIdentifiers = 'LiteralTextarea'
  static shouldRender(props: TermLiteral.Props) {
    return props.config && props.config.type === 'textarea';
  }


  render() {
    const term = this.props.value.getTerm()
    return (
      <div className={styles.textarea}>
      {term.value}
      </div>
    );
  }
}
export default TermLiteralTextarea;
