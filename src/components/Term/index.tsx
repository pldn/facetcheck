//external dependencies
import * as React from 'react';

import * as N3 from 'n3'
import * as getClassName from 'classnames'
// import {Table,Button} from 'react-bootstrap';
//import own dependencies
// import { ITerm} from 'reducers/data'
import {
  TermLink,
  TermLiteral,
  TermGeo
} from 'components'
// import {State as LabelsState,getLabel,fetchLabel} from 'reducers/labels'
export module Term {
  export interface Props {
    className?: string,
    term:string
    context: N3.Statement[]
    label?: string,
    // fetchLabel: typeof fetchLabel
  }

}

const styles = require('./style.scss');
//used for e.g. IRIs and graphnames
class Term extends React.PureComponent<Term.Props,any> {
  render() {
    const {term,className,context,label} = this.props;

    if (TermGeo.acceptsTerm(term,context)) return <TermGeo term={term} context={context}/>
    if (TermLink.acceptsTerm(term, context)) return <TermLink className={className} iri={term} label={label}/>
    if (TermLiteral.acceptsTerm(term, context)) return <TermLiteral className={className} datatype={N3.Util.getLiteralType(term)} showDatatype={false} value={N3.Util.getLiteralValue(term)}/>
    return <div/>//should not happen..
  }
}
export default Term
