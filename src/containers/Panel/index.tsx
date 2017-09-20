//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
//import own dependencies
import { asyncConnect, IAsyncConnect } from "redux-connect";
// import ResourceTreeItem from 'helpers/ResourceTreeItem'
import { GlobalState } from "reducers";
import {FacetsValues,toggleClass, CLASSES,FACETS,SelectedClasses,FacetsProps,setFacetMultiselectValue} from 'reducers/facets'
// import {State as SchemaState} from 'reducers/schema'
// import {getLabel, State as LabelsState} from 'reducers/labels'
// import { State as FacetState,ActiveClasses,setActiveClasses,getSelectedClasses,setFacetFilter} from 'reducers/facets'
// import { Shapes,getShapesForClasses} from 'reducers/schema'
import {
  // DataAdd
  PanelItem,
  FacetMultiSelect,
  Facet
} from "components";
import {} from "containers";

namespace Panel {
  // export interface OwnProps extends IComponentProps {
  // }
  export interface DispatchProps {
    toggleClass: typeof toggleClass
    setFacetMultiselectValue: typeof setFacetMultiselectValue
  }
  export interface PropsFromState {
    selectedClasses: SelectedClasses,
    facetsValues: FacetsProps
  }

  export interface State {
  }
  export type Props =  DispatchProps & PropsFromState;
}

const styles = require("./style.scss");

class Panel extends React.PureComponent<Panel.Props, Panel.State> {

  renderFacets() {
    const {facetsValues} = this.props;
    return facetsValues.valueSeq().map((facet) => {
      const iri = facet.iri;
      const staticFacetConfig = FACETS[iri];
      if (!staticFacetConfig) throw new Error('Missing facet config for ' + iri);
      if (staticFacetConfig.facetType === 'multiselect') {
        return <div key={iri} className={styles.section}>
          <div className={styles.sectionHeader}>{staticFacetConfig.label}</div>

          <FacetMultiSelect

          options={facet.values.map((val) => {
            return {
              value: val.value,
              label: val.label,
              checked: facet.selectedValues.has(val.value)
            }
          })}
          onChange={(valueKey, checked) => {
            this.props.setFacetMultiselectValue(iri, valueKey, checked)
          }}
          />
          </div>
      }
      return null;

    })
    // return null;
  }

    //   getShapesForClasses(getSelectedClasses(facets),shapes).map((shape) => {
    //   return <Facet
    //     key={shape.predicate}
    //     disabled={refreshingShapes}
    //     setFacetFilter={this.props.setFacetFilter}
    //     filter={facets.facetFilters[shape.predicate] }
    //     label={getLabel(labels, shape.predicate)}
    //     shape={shape}
    //     labels={labels}
    //     />
    // })
  render() {
    const {

      selectedClasses
    } = this.props;

    const classNames: { [className: string]: boolean } = {
      [styles.panel]: true,
      [styles.main]: true
    };
    return (
      <div className={getClassName(classNames)}>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Classes</div>
          <FacetMultiSelect
            options={selectedClasses.map((val,key) => {
              return {
                value: key,
                label: CLASSES[key].label,
                checked: val,
              }
            }).valueSeq().toArray()}
            onChange={this.props.toggleClass}
            />


        </div>
        {this.renderFacets()}

      </div>
    );
  }
}
// export default Panel;




export default connect<GlobalState, Panel.PropsFromState, Panel.DispatchProps, {}>(
  (state, ownProps) => {
    return {
      selectedClasses: state.facets.selectedClasses,
      facetsValues: state.facets.facetsValues
      // addedDsName: state.datasetManagement.added,
      // datasets: state.datasetManagement.list,
      // fetchingList: state.datasetManagement.fetchingList,
      // fetchingListError: state.datasetManagement.fetchingListError,
      // currentAccount: state.accounts.current,
      // acl: Acl.Get(state.auth.user),
      // nextPage: state.datasetManagement.nextPage,
      // orgMembers: state.accounts.current && state.orgs.members.get(state.accounts.current.accountName),
      // orgs: state.accounts.current && state.orgs.orgs.get(state.accounts.current.accountName)
    };
  },
  //dispatch
  {
    toggleClass:toggleClass,
    setFacetMultiselectValue: setFacetMultiselectValue
    // addDataset,
    // getDatasets,
    // impersonateTo,
    // pushState: reactRouterRedux.push
  }
)(Panel);
