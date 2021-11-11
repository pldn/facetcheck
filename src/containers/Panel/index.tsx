//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { connect } from "react-redux";
import getClassName from "classnames";
//import own dependencies
import { RadioGroup, RadioButton } from "react-toolbox/lib/radio";

import { GlobalState } from "../../reducers";
import {
  setSelectedClass,
  FacetsProps,
  setSelectedFacetValue,
  setSelectedObject,
  FacetState,
  setSelectedSearchString
} from "../../reducers/facets";
import { CLASSES } from "../../facetConf";
import { Facet } from "../../components";
import {} from "../";

declare namespace Panel {
  export interface OwnProps {}
  export interface DispatchProps {
    setSelectedClass: typeof setSelectedClass;
    setSelectedFacetValue: typeof setSelectedFacetValue;
    setSelectedObject: typeof setSelectedObject;
    setSelectedSearchString: typeof setSelectedSearchString;
  }
  export interface PropsFromState {
    selectedClass: string;
    facets: FacetsProps;
    facetLabels: FacetState["facetLabels"];
  }

  export interface State {}
  export type Props = DispatchProps & PropsFromState;
}

import * as styles from "./style.module.scss";

declare namespace ClassSelector {
  export interface Props {
    selectedClass: string;
    setSelectedClass: (className: string) => void;
  }
}
const ClassSelector = React.memo<ClassSelector.Props>(props => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>Class</div>
      {
        <RadioGroup className={styles.classSelectors} name="classSelector" value={props.selectedClass} onChange={props.setSelectedClass}>
          {CLASSES.map(classConf => {
            return <RadioButton key={classConf.iri} label={classConf.label} value={classConf.iri} />
          }
          )}
        </RadioGroup>
      }
    </div>
  );
});
class Panel extends React.PureComponent<Panel.Props, Panel.State> {
  render() {
    const { setSelectedObject, setSelectedFacetValue, facetLabels, setSelectedSearchString } = this.props;

    const classNames: { [className: string]: boolean } = {
      [styles.panel]: true,
      [styles.main]: true
    };
    return (
      <div className={getClassName(classNames)}>
        <ClassSelector selectedClass={this.props.selectedClass} setSelectedClass={this.props.setSelectedClass} />

        {this.props.facets.valueSeq().map(facet => {
          return (
            <Facet
              key={facet.iri}
              facet={facet}
              label={facetLabels.get(facet.iri)}
              className={styles.section}
              setSelectedFacetValue={setSelectedFacetValue}
              setSelectedObject={setSelectedObject}
              setSelectedSearchString={setSelectedSearchString}
            />
          );
        })}
      </div>
    );
  }
}
// export default Panel;

export default connect<Panel.PropsFromState, Panel.DispatchProps, Panel.OwnProps, GlobalState>(
  (state, _ownProps) => {
    return {
      selectedClass: state.facets.selectedClass,
      facets: state.facets.facets,
      facetLabels: state.facets.facetLabels
    };
  },
  //dispatch
  {
    setSelectedClass: setSelectedClass,
    setSelectedObject: setSelectedObject,
    setSelectedFacetValue: setSelectedFacetValue,
    setSelectedSearchString: setSelectedSearchString
  }
)(Panel);
