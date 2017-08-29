//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
import * as N3 from "n3";
import * as _ from 'lodash'
//import own dependencies
import { Term, TermLink, TermLiteral } from "components";
import * as Immutable from 'immutable';
import {Paths, getLabel} from 'reducers/statements'
const styles = require("./style.scss");
namespace Statements {
  export interface GroupedStatements {
    [predicate: string]: string[];
  }

  export interface Props {
    resourceContext: Immutable.List<N3.Statement>
    paths: Paths
  }
}

class Statements extends React.PureComponent<Statements.Props, any> {

  renderKey() {
    const {paths,resourceContext} = this.props;
    return <Term
      resourceContext={this.props.resourceContext}
      className={styles.pred}
      term={paths[0][0].predicate}
      label={getLabel(paths[0][0].predicate,resourceContext)}
    />
  }
  render() {
    const {
      paths
      // labels
    } = this.props;
    return (
      <div className={styles.statement}>
        {this.renderKey()}
        <div className={styles.objs}>
          {paths.map(path =>
            {
              const last = _.last(path);
              
              return <Term
              key={JSON.stringify(path)}
              resourceContext={this.props.resourceContext}
              className={styles.obj}
              term={last.object}
              />
            }
          )}
        </div>
      </div>
    );
  }
}

export default Statements;
