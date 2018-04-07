//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
//import own dependencies
import { asyncConnect, IAsyncConnect } from "redux-connect";
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';

import Checkbox from 'react-toolbox/lib/checkbox';
import { GlobalState } from "../../reducers";
import {setSelectedClass,FacetsProps,setSelectedFacetValue,setSelectedObject,StateRecordInterface} from '../../reducers/facets'
import {CLASSES,FACETS} from '../../facetConf'
import {
  Facet,
} from "../../components";
import {} from "../";

namespace Panel {
  // export interface OwnProps extends IComponentProps {
  // }
  export interface DispatchProps {
    setSelectedClass: typeof setSelectedClass
    setSelectedFacetValue: typeof setSelectedFacetValue
    setSelectedObject: typeof setSelectedObject
  }
  export interface PropsFromState {
    selectedClass: string,
    facets: FacetsProps
    facetLabels: StateRecordInterface['facetLabels']
  }

  export interface State {
  }
  export type Props =  DispatchProps & PropsFromState;
}

const styles = require("./style.scss");

class Panel extends React.PureComponent<Panel.Props, Panel.State> {


  renderClasses() {
    return <div className={styles.section}>
      <div className={styles.sectionHeader}>Class</div>
      {
        <RadioGroup value={this.props.selectedClass} onChange={this.props.setSelectedClass}>

        {
          _.keys(CLASSES).map(key => <RadioButton key={key} label={CLASSES[key].label} value={CLASSES[key].iri}/>)

        }
        </RadioGroup>
      // this.props.selectedClass.map((val,key) => {
      //   const CLASS = CLASSES[key]
      //     return <Checkbox
      //       label={CLASS.label}
      //       checked={val}
      //       key={key}
      //       onChange={(checked:boolean) => {
      //         this.props.toggleClass(key, checked)
      //       }}
      //       />
      // }).valueSeq().toArray()
      }



    </div>
  }
  render() {
    const {
      setSelectedObject,
      setSelectedFacetValue,
      facetLabels,
    } = this.props;

    const classNames: { [className: string]: boolean } = {
      [styles.panel]: true,
      [styles.main]: true
    };

    return (
      <div className={getClassName(classNames)}>
        {this.renderClasses()}

        {
          this.props.facets.valueSeq().map((facet) => {
            return <Facet key={facet.iri} facet={facet} label={facetLabels.get(facet.iri)} className={styles.section} setSelectedFacetValue={setSelectedFacetValue} setSelectedObject={setSelectedObject}/>
          })
        }

      </div>
    );
  }
}
// export default Panel;




export default connect<GlobalState, Panel.PropsFromState, Panel.DispatchProps, {}>(
  (state, ownProps) => {
    return {
      selectedClass: state.facets.selectedClass,
      facets: state.facets.facets,
      facetLabels:state.facets.facetLabels
    };
  },
  //dispatch
  {
    setSelectedClass:setSelectedClass,
    setSelectedObject: setSelectedObject,
    setSelectedFacetValue:setSelectedFacetValue
  }
)(Panel);
