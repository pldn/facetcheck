//external dependencies
import * as React from 'react';

import * as N3 from 'n3'
import * as getClassName from 'classnames'
// import {Table,Button} from 'react-bootstrap';
import {Link} from 'react-router'
//import own dependencies
// import { ITerm} from 'redux/modules/data'
export module TermLink {

  export interface Props {
    className?: string,
    iri:string,
    label?:string,
    link?:{
      to: string,
      query?:Object
    }
  }
}
const styles = require('./style.scss');

//used for e.g. IRIs and graphnames
class TermLink extends React.PureComponent<TermLink.Props,any> {
  static acceptsTerm(term:string, context:N3.Statement[]){
    return N3.Util.isIRI(term)
  }
  render() {
    const {className, iri, label} = this.props;
    const link = this.props.link || {to:iri, target:"_blank"}
    return <div className={getClassName(styles.link,className)}>
        {/*<a className={styles.extLink} href={iri} target="_blank" title={"Open external link in new window"}><i className="fa fa-link"/></a>*/}
        <Link {...link}>{label || iri}</Link>
      </div>
  }
}
export default TermLink
