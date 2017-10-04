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
  export interface Props {
    className?: string;
    forIri: string;
    statements: Statements
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {



  render() {
    const {
      className,
      statements,
      forIri
    } = this.props;

    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className
    };

    const tree=getStatementsAsTree(forIri, statements);
    const rootWidget = getWidgets(tree);
    const {label, ...widget} = rootWidget;
    return (
      <div className={getClassNames(style)}>
        <div className={styles.header}>

          <div className={styles.iri}>
            <a href={forIri} target="_blank">
              {
                label || getLabel(forIri,tree)
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
