//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from '../../reducers/labels'
import { ResourceDescriptionSection } from "../";
import {getLabel, getWidgets,WidgetConfig,getStatementsAsTree} from '../../reducers/statements'


import * as styles from "./style.module.scss"
declare namespace ResourceDescription {
  export interface Props {
    className?: string;
    forIri: string;
    statements: N3.Quad[],
    fetchingMatchingIris: boolean
    selectedClass: string
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {



  render() {
    const {
      className,
      statements,
      forIri,
      fetchingMatchingIris
    } = this.props;

    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className,
      [styles.overlay]: fetchingMatchingIris
    };
    const iriTerm = N3.DataFactory.namedNode(forIri)
    const tree=getStatementsAsTree(iriTerm, statements);
    const rootWidget = getWidgets(tree);
    const {label, ...widget} = rootWidget;
    return (
      <div className={getClassNames(style)}>
        <div className={styles.header}>

          <div className={styles.iri}>
            <a href={forIri} target="_blank" rel="noopener noreferrer">
              {
                label || getLabel(iriTerm,tree)
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
