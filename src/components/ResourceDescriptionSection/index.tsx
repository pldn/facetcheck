//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from 'immutable'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { Statements} from "components";
import {getPaths,Paths,groupPaths, getLabel} from 'reducers/statements'


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
    forIri: string;
    statements: Immutable.List<N3.Statement>;
    level?:number
  }
}

class ResourceDescriptionSection extends React.PureComponent<ResourceDescriptionSection.Props, any> {
  static defaultProps:Partial<ResourceDescriptionSection.Props> = {
    level: 0
  }


  render() {
    const {
      forIri,
      statements,
      level
    } = this.props;
    const groupedPaths = groupPaths(getPaths(statements.toArray(), forIri));
    const rows: any[] = [];


    for (var groupKey  in groupedPaths) {
      rows.push(
        <Statements
          key={groupKey}
          paths={groupedPaths[groupKey]}
          resourceContext={this.props.statements}
        />
      );
    }
    return <div className={styles.statements}>{rows}</div>;

  }
}

export default ResourceDescriptionSection;
