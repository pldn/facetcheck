//external dependencies
import * as React from "react";
import * as N3 from "n3";
import getClassName from "classnames";
import Tree from '../../helpers/Tree'
export declare namespace TermLink {
  export interface Props {
    className?: string;
    value: Tree
    label?: string;
    link?: {
      to: string;
      query?: Object;
    };
  }
}
import * as styles from "./style.module.scss"

//used for e.g. IRIs and graphnames
class TermLink extends React.PureComponent<TermLink.Props, any> {
  static acceptsTerm(term:N3.Term) {
    return term.termType === "NamedNode"
  }
  render() {
    const { className, label } = this.props;
    const term = this.props.value.getTerm()
    return (
      <div className={getClassName(styles.link, className)}>
        <a className={styles.extLink} href={term.value} target="_blank" title={term.value}>{label || term.value}</a>
      </div>
    );
  }
}
export default TermLink;
