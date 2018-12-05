//external dependencies
import * as React from "react";
import * as _ from "lodash";
import * as N3 from "n3";
import { TermLiteral } from "../";
import * as styles from "./style.module.scss";
@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export class TermLiteralTextarea extends React.PureComponent<TermLiteral.Props, any> {
  tags: { language: string; script: string; region: string; regionCode: string };

  constructor(props: TermLiteral.Props) {
    super(props);
  }
  static WidgetName: TermLiteral.WidgetIdentifiers = "LiteralTextarea";
  static shouldRender(props: TermLiteral.Props) {
    const term = props.value.getTerm()
    return (
      props.config &&
      props.config.type === "textarea" &&
      term.termType === "Literal" &&
      term.datatypeString === "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML"
    );
  }

  render() {
    const term = this.props.value.getTerm();
    return <div className={styles.htmlTextArea} dangerouslySetInnerHTML={{ __html: term.value }} />;
  }
}
export default TermLiteralTextarea;
