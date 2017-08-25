//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
import * as N3 from "n3";
//import own dependencies
import { Term, TermLink, TermLiteral } from "components";
import * as Immutable from 'immutable';
const styles = require("./style.scss");
namespace Statements {
  export interface GroupedStatements {
    [predicate: string]: string[];
  }

  export interface Props {
    context: Immutable.List<N3.Statement>
    predicate: string;
    objects: string[];
  }
}

class Statements extends React.PureComponent<Statements.Props, any> {

  render() {
    const {
      predicate,
      objects
      // labels
    } = this.props;
    return (
      <div className={styles.statement}>
        <Term
          context={this.props.context}
          className={styles.pred}
          term={predicate}
        />
        <div className={styles.objs}>
          {objects.map(obj =>
            <Term
              key={obj}
              context={this.props.context}
              className={styles.obj}
              term={obj}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Statements;
