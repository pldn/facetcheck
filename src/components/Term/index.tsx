//external dependencies
import * as React from "react";

import * as N3 from "n3";
import * as getClassName from "classnames";
import * as Immutable from 'immutable'
//import own dependencies
import { TermLink, TermLiteral} from "components";
import Tree from 'helpers/Tree'
import {RenderConfiguration,getLabel} from  'reducers/statements'
import * as nTriply from '@triply/triply-node-utils/build/src/nTriply'
export namespace Term {
  export interface Props {
    className?: string;
    value: Tree;
    label?: string;
    config?:RenderConfiguration
    tree:Tree
    selectedClass:string
    // fetchLabel: typeof fetchLabel
  }
}

const styles = require("./style.scss");
class Term extends React.PureComponent<Term.Props, any> {
  render() {
    const {value, className, label,config,tree } = this.props;
    const term = this.props.value.getTerm()
    // if (TermGeo.acceptsTerm(term, resourceContext)) return <TermGeo term={term} context={resourceContext} />;
    // if (TermLink.acceptsTerm(term, resourceContext)) return <TermLink className={className} iri={term} label={label} />;
    if (term.termType=== 'literal') {
      return (
        <TermLiteral
        selectedClass={this.props.selectedClass}
          className={className}
          value={value}
          config={config}
        />
      );
    } else {
      return <TermLink className={className} value={value} label={label || getLabel(term.value, tree)} />
    }
  }
}
export default Term;
