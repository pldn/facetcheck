//external dependencies
import * as React from "react";
import * as nTriply from '@triply/triply-node-utils/build/src/nTriply'
import * as N3 from "n3";
import * as getClassName from "classnames";
import * as Immutable from 'immutable'
// import {Table,Button} from 'react-bootstrap';
import { Link } from "react-router";
//import own dependencies
// import { ITerm} from 'reducers/data'
export namespace TermLink {
  export interface Props {
    className?: string;
    term: nTriply.Term
    label?: string;
    link?: {
      to: string;
      query?: Object;
    };
  }
}
const styles = require("./style.scss");

//used for e.g. IRIs and graphnames
class TermLink extends React.PureComponent<TermLink.Props, any> {
  static acceptsTerm(term: string, context: Immutable.List<N3.Statement>) {
    return N3.Util.isIRI(term);
  }
  render() {
    const { className, term, label } = this.props;
    const link = this.props.link || { to: term.value, target: "_blank" };
    return (
      <div className={getClassName(styles.link, className)}>
        {/*<a className={styles.extLink} href={iri} target="_blank" title={"Open external link in new window"}><i className="fa fa-link"/></a>*/}
        <Link {...link}>
          {label || term.value}
        </Link>
      </div>
    );
  }
}
export default TermLink;
