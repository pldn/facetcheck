//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from 'immutable'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { TermRenderer} from "components";
import {Paths, getLabel, selectRenderer} from 'reducers/statements'
import Tree from 'helpers/Tree'

const styles = require("./style.scss");
namespace ResourceDescriptionSection {

  export interface StatementContext {
    path: N3.Statement[],
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
    tree: Tree;
    level?:number
  }
}

class ResourceDescriptionSection extends React.PureComponent<ResourceDescriptionSection.Props, any> {
  static defaultProps:Partial<ResourceDescriptionSection.Props> = {
    level: 0
  }


  render() {
    const {
      tree,
      level
    } = this.props;
    // const groupedPaths = groupPaths(getPaths(statements.toArray(), forIri));
    const renderers = selectRenderer(tree);
    const rows:any[] = []
    for (const renderer of renderers) {
      console.log(renderer.label + renderer.values.map(node => node.getKey()).join(','))
      rows.push(<TermRenderer
        key={renderer.label + renderer.values.map(node => node.getKey()).join(',')}
        label={renderer.label}
        values={renderer.values}
      />)
    }

    // for (var node of tree.getChildren()) {
    //
    // }
    // for (var groupKey  in groupedPaths) {
    //   rows.push(
    //     <Statements
    //       key={groupKey}
    //       paths={groupedPaths[groupKey]}
    //       resourceContext={tree}
    //     />
    //   );
    // }
    return <div className={styles.statements}>{rows}</div>;

  }
}

export default ResourceDescriptionSection;
