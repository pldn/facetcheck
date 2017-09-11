//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from 'immutable'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { ResourceDescriptionSection } from "components";
import Tree from 'helpers/Tree'
import {getLabel} from 'reducers/statements'


const styles = require("./style.scss");
namespace ResourceDescription {

  export interface StatementContext {
    Tree: N3.Statement[],
    value: string
  }
  export interface GroupedStatements {
    [fingerPrint: string]: StatementContext[];
  }
  // statementContext: Statement[
  // <sub> geo:hasGemeometry _bnode .
  // _bnode geo:asWkt "wktString"
  // ],
  // value: "wktString"
  // resourceContext: Statement[]
  //
  //
  //
  export interface Props {
    className?: string;
    // forIri: string;
    tree: Tree;
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {



  render() {
    const {
      // forIri,
      className,
      tree,
      // labels,fetchLabel
    } = this.props;

    const rootTerm = tree.getTerm();
    const label = getLabel(rootTerm,tree)
    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className
    };
    return (
      <div className={getClassNames(style)}>
        <div className={styles.header}>

          <div className={styles.iri}>
            <a href={rootTerm} target="_blank">
              {
                label || rootTerm
              }
            </a>
          </div>
        </div>
        <ResourceDescriptionSection tree={tree}/>
      </div>
    );
  }
}

export default ResourceDescription;
