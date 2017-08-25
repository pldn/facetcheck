//external dependencies
import * as React from "react";

import * as N3 from "n3";
import * as getClassName from "classnames";
import * as Immutable from 'immutable'
//import own dependencies
import { TermLink, TermLiteral, TermGeo } from "components";
export namespace Term {
  export interface Props {
    className?: string;
    term: string;
    context: Immutable.List<N3.Statement>;
    label?: string;
    // fetchLabel: typeof fetchLabel
  }
}

const styles = require("./style.scss");
class Term extends React.PureComponent<Term.Props, any> {
  render() {
    const { term, className, context, label } = this.props;

    if (TermGeo.acceptsTerm(term, context)) return <TermGeo term={term} context={context} />;
    if (TermLink.acceptsTerm(term, context)) return <TermLink className={className} iri={term} label={label} />;
    if (N3.Util.isLiteral(term))
      return (
        <TermLiteral
          className={className}
          datatype={N3.Util.getLiteralType(term)}
          // showDatatype={false}
          termType={"Literal"}
          language={N3.Util.getLiteralLanguage(term)}
          value={N3.Util.getLiteralValue(term)}
        />
      );
    return <div />; //should not happen..
  }
}
export default Term;
