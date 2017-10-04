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
import {getLabel, getWidgets,WidgetConfig,Statements,getStatementsAsTree} from 'reducers/statements'


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
    forIri: string;
    statements: Statements
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {



  render() {
    const {
      // forIri,
      className,
      statements,
      forIri
      // labels,fetchLabel
    } = this.props;

    // const rootTerm = tree.getTerm();
    // const label = getLabel(rootTerm,tree)
    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className
    };

    const tree=getStatementsAsTree(forIri, statements);
    const rootWidget = getWidgets(tree);
    // export interface RenderSelection {
    //   label?:string,
    //   values?:Tree[]//a node in the tree,
    //   config?: RenderConfiguration,
    //   subSections?: RenderSelection[]
    //   key?:string
    // }
    const {label, ...widget} = rootWidget;
    console.log(widget)
    return (
      <div className={getClassNames(style)}>
        <div className={styles.header}>

          <div className={styles.iri}>
            <a href={forIri} target="_blank">
              {
                label || forIri
              }
            </a>
          </div>
        </div>
        <ResourceDescriptionSection tree={tree} widget={widget}/>
      </div>
    );
  }
}

export default ResourceDescription;
