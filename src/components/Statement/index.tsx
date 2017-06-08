//external dependencies
import * as React from 'react';
import * as getClassNames from 'classnames'
import * as UriJs from 'urijs'
import * as N3 from 'n3'
import * as _ from 'lodash'
//import own dependencies
// import {getLabel, State as Labels,fetchLabel} from 'redux/modules/labels'
import {
  Term,
  TermLink,
  TermLiteral
} from 'components'


const styles = require('./style.scss')
module ResourceDescription {
  export interface GroupedStatements {
    [predicate:string]: string[];
  }

  export interface Props {
    // labels: Labels
    context: N3.Statement[]
    predicate:string, objects:string[],
    // fetchLabel: typeof fetchLabel
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props,any> {

  // groupStatementsByPred():ResourceDescription.GroupedStatements {
  //   return _.transform(this.props.statements, function(result:ResourceDescription.GroupedStatements, statement) {
  //     if (!result[statement.predicate]) result[statement.predicate] = [];
  //     result[statement.predicate].push(statement.object)
  //   }, {})
  // }

  render() {
    const {predicate,objects,
      // labels
    } = this.props;
    var style = {
      [styles.statement]: styles.statement,
    }
    return <div className={styles.statement}>
      <Term context={this.props.context} className={styles.pred} term={predicate}
      // label={
      //   // getLabel(labels,predicate)
      // }
      />
      <div className={styles.objs}>
        {objects.map(obj => <Term key={obj} context={this.props.context} className={styles.obj} term={obj}
          // label={getLabel(labels, obj)}
          />)}
      </div>
    </div>
  }
}

export default ResourceDescription;
