//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
//import own dependencies
import { IComponentProps } from "containers";
import { toggleDsPanelCollapseLg } from "reducers/app";
// import {getSubclassRelations} from 'reducers/schema'
import { asyncConnect, IAsyncConnect } from "redux-connect";
// import ResourceTreeItem from 'helpers/ResourceTreeItem'
import { GlobalState } from "reducers";
import {FacetsConfig,toggleClass} from 'reducers/facets'
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
  export interface OwnProps extends IComponentProps {
  }
  export interface DispatchProps {
    toggleClass: typeof toggleClass
  }
  export interface PropsFromState {
    facets: FacetsConfig
  }

  export interface State {
  }
  export type Props = OwnProps & DispatchProps & PropsFromState;
}

const styles = require("./style.scss");
const mapStateToProps = (state: GlobalState, ownProps: Panel.Props) => {
  return {
    // activeClasses: state.facets.activeClasses,
    // subClassRelations: state.schema.subclassRelations,
    // labels: state.labels,
    // facets: state.facets,
    // shapes: state.schema.shapes,
    // refreshingShapes: state.schema.gettingShapes
  };
};
const mapDispatchToProps: MapDispatchToPropsObject = {
  toggleDsPanelCollapseLg
  // setActiveClasses,
  // setFacetFilter,
};

@(connect as any)(mapStateToProps, mapDispatchToProps)
class Panel extends React.PureComponent<Panel.Props, Panel.State> {
  //cant use base component that does shallow compare, as the panels won't update with a new active state.
  //might be because react-router-bootstrap clones its children?
  state: Panel.State = {
    subclassTree: null
  };



  render() {
    const {
      // refreshingShapes,
      // shapes,
      // className,
      // toggleDsPanelCollapseLg,
      // collapsed,
      // currentClass,
      // subClassRelations
      // labels,facets
      facets
    } = this.props;
    //assuming schema is static

    const classNames: { [className: string]: boolean } = {
      [styles.panel]: true,
      [styles.main]: true
      // [styles.collapsed]: collapsed
    };
    // const classes = _.keys(facetConfig);
    // const currentPath = "/" + currentAccount.accountName + '/' + currentDs.name + '/';
    return (
      <div className={getClassName(classNames)}>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Classes</div>
          <FacetMultiSelect
            options={facets.valueSeq().toArray().map(val => {
              return {
                value: val.iri,
                label: val.label,
                checked: val.selected,
              }
            })}
            onChange={this.props.toggleClass}
            />
          {
            //   this.state.subclassTree &&
            // <div className={getClassName(styles.section, styles.staticFacets)}>
            //   <div className={styles.sectionHeader}>
            //     Classes
            //   </div>
            //   <FacetMultiSelect
            //   onChange={this.props.setActiveClasses}
            //   activeValues={facets.activeClasses}
            //   options={this.getClassOptions()}
            //   forShape={null}
            //   />
            // </div>
          }
          {
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
          }
        </div>
        {/**
        <Button className={getClassName('resetButton', styles.toggler, styles.footer)} onClick={toggleDsPanelCollapse}>
          <i className={getClassName({fa:true, 'fa-chevron-left': !collapsed, 'fa-chevron-right': collapsed})}></i>
        </Button>
        **/}
      </div>
    );
  }
}
// export default Panel;




export default connect<GlobalState, Panel.PropsFromState, Panel.DispatchProps, Panel.OwnProps>(
  (state, ownProps) => {
    return {
      facets: state.facets.config
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
    toggleClass:toggleClass
    // addDataset,
    // getDatasets,
    // impersonateTo,
    // pushState: reactRouterRedux.push
  }
)(Panel);
