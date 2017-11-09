//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from 'immutable'
import * as nTriply from '@triply/triply-node-utils/build/src/nTriply'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { ResourceDescriptionSection } from "components";
import Tree from 'helpers/Tree'
import {getLabel, getWidgets,WidgetConfig,getStatementsAsTree} from 'reducers/statements'


const styles = require("./style.scss");
namespace ResourceDescription {
  export interface Props {
    className?: string;
    forIri: string;
    statements: nTriply.Statements,
    fetchingMatchingIris: boolean
    selectedClass: string
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
      [className]: !!className,
    };

    const tree=getStatementsAsTree({value: forIri, termType:'iri'}, statements);
    const rootWidget = getWidgets(tree);
    const {label, ...widget} = rootWidget;
    return (
      <div className={getClassNames(style)}>
      {this.props.fetchingMatchingIris && <div className={styles.overlay}/>}
        <div className={styles.header}>

          <div className={styles.iri}>
            <a href={forIri} target="_blank">
              {
                label || getLabel(forIri,tree)
              }
            </a>
          </div>
        </div>
        <ResourceDescriptionSection tree={tree} selectedClass={this.props.selectedClass} widget={widget}/>
      </div>
    );
  }
}

export default ResourceDescription;
