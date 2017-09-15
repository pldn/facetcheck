//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
import * as N3 from "n3";
import * as _ from 'lodash'
//import own dependencies
import { Term, TermLink, TermLiteral } from "components";
import * as Immutable from 'immutable';
import {Paths, getLabel} from 'reducers/statements'
import Tree from 'helpers/Tree'
const styles = require("./style.scss");
namespace TermRenderer {
  export interface Props {
    label: string,
    values: Tree[]
  }
}

class TermRenderer extends React.PureComponent<TermRenderer.Props, any> {

  render() {
    const {
      values,
      // labels
      label
    } = this.props;
    return (
      <div className={styles.statement}>
        {label && <div className={styles.title}><span>{label}</span></div>}
        <div className={styles.values}>
          {values.map(value =>
              <Term
              key={value.getKey()}
              className={styles.obj}
              term={value.getTerm()}
              />

          )}
        </div>
      </div>
    );
  }
}

export default TermRenderer;
