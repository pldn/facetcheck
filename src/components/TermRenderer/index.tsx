//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
import * as N3 from "n3";
import * as _ from 'lodash'
//import own dependencies
import { Term, TermLink, TermLiteralTextarea } from "components";
import * as Immutable from 'immutable';
import {Paths, getLabel,RenderConfiguration} from 'reducers/statements'
import Tree from 'helpers/Tree'
const styles = require("./style.scss");
namespace TermRenderer {
  export interface Props {
    label: string,
    values: Tree[]
    config?:RenderConfiguration
  }
}

class TermRenderer extends React.PureComponent<TermRenderer.Props, any> {

  render() {
    const {
      values,
      config,
      label
    } = this.props;

    const enabledStyles:{[key:string]:boolean} = {
      [styles.statement]: !!styles.statement,
      [styles.dynamic]: config && config.size === 'dynamic',
      [styles.full]: !config || !config.size || config.size === 'full'
    }
    return (
      <div className={getClassNames(enabledStyles)}>
        {label && <div className={styles.title}><span>{label}</span></div>}
        <div className={styles.values}>
          {values.map(value =>
              <Term
              key={value.getKey()}
              className={styles.obj}
              term={value.getTerm()}
              config={config}
              />

          )}
        </div>
      </div>
    );
  }
}

export default TermRenderer;
