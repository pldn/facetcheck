//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
//import own dependencies
import { asyncConnect, IAsyncConnect } from "redux-connect";
import Checkbox from 'react-toolbox/lib/checkbox';
import { GlobalState } from "reducers";
import {toggleClass,SelectedClasses,FacetsProps,setSelectedFacetValue,setSelectedObject} from 'reducers/facets'
import {CLASSES,FACETS} from 'facetConf'
import {
  Facet,
} from "components";
import {} from "containers";

namespace Panel {
  // export interface OwnProps extends IComponentProps {
  // }
  export interface DispatchProps {
    toggleClass: typeof toggleClass
    setSelectedFacetValue: typeof setSelectedFacetValue
    setSelectedObject: typeof setSelectedObject
  }
  export interface PropsFromState {
    selectedClasses: SelectedClasses,
    facets: FacetsProps
  }

  export interface State {
  }
  export type Props =  DispatchProps & PropsFromState;
}

const styles = require("./style.scss");

class Panel extends React.PureComponent<Panel.Props, Panel.State> {


  renderClasses() {
    return <div className={styles.section}>
      <div className={styles.sectionHeader}>Classes</div>
      {
      this.props.selectedClasses.map((val,key) => {
        const CLASS = CLASSES[key]
          return <Checkbox
            label={CLASS.label}
            checked={val}
            key={key}
            onChange={(checked:boolean) => {
              this.props.toggleClass(key, checked)
            }}
            />
      }).valueSeq().toArray()
      }



    </div>
  }
  render() {
    const {
      setSelectedObject,
      setSelectedFacetValue
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
            return <Facet key={facet.iri} facet={facet} className={styles.section} setSelectedFacetValue={setSelectedFacetValue} setSelectedObject={setSelectedObject}/>
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
      selectedClasses: state.facets.classes,
      facets: state.facets.facets
    };
  },
  //dispatch
  {
    toggleClass:toggleClass,
    setSelectedObject: setSelectedObject,
    setSelectedFacetValue:setSelectedFacetValue
  }
)(Panel);
