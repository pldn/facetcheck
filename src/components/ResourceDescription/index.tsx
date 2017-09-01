//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from 'immutable'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { ResourceDescriptionSection } from "components";
import {getLabel} from 'reducers/statements'


const styles = require("./style.scss");
namespace ResourceDescription {

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
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {



  render() {
    const {
      forIri,
      className,
      statements,
      // labels,fetchLabel
    } = this.props;
    const label = getLabel(forIri,statements)
    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className
    };
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
        <ResourceDescriptionSection forIri={forIri} statements={statements}/>
      </div>
    );
  }
}

export default ResourceDescription;