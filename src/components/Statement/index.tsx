//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
import * as UriJs from "urijs";
import * as N3 from "n3";
import * as _ from "lodash";
//import own dependencies
// import {getLabel, State as Labels,fetchLabel} from 'redux/modules/labels'
import { Term, TermLink, TermLiteral } from "components";
import * as Immutable from 'immutable';
const styles = require("./style.scss");
namespace Statement {
  export interface GroupedStatements {
    [predicate: string]: string[];
  }

  export interface Props {
    // labels: Labels
    context: Immutable.List<N3.Statement>
    predicate: string;
    objects: string[];
    // fetchLabel: typeof fetchLabel
  }
}

class Statement extends React.PureComponent<Statement.Props, any> {

  render() {
    const {
      predicate,
      objects
      // labels
    } = this.props;
    var style = {
      [styles.statement]: styles.statement
    };
    return (
      <div className={styles.statement}>
        <Term
          context={this.props.context}
          className={styles.pred}
          term={predicate}
          // label={
          //   // getLabel(labels,predicate)
          // }
        />
        <div className={styles.objs}>
          {objects.map(obj =>
            <Term
              key={obj}
              context={this.props.context}
              className={styles.obj}
              term={obj}
              // label={getLabel(labels, obj)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Statement;
