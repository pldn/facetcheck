//external dependencies
import * as React from "react";
import * as _ from "lodash";
import * as Helmet from "react-helmet";
import * as getClassName from "classnames";
import { formValueSelector } from "redux-form";
import * as Immutable from "immutable";
//import own dependencies
// import {State as LabelsState, fetchLabel} from 'reducers/labels'
import { Grid, Row, Col, Button } from "react-bootstrap";
import * as N3 from "n3";
import { ResourceDescription, Svg } from "components";

import { connect } from "react-redux";
import { GlobalState } from "reducers";
// import {getResourceDescription,Statement} from 'reducers/viewer';
import { ResourceDescriptions, getStatementsAsTree } from "reducers/statements";
// import {State as FacetState,getMatchingIris, facetsChanged,matchingIrisChanged} from 'reducers/facets';

namespace Home {
  // export interface OwnProps {
  //
  //   }
  export interface DispatchProps {
    // getDatasets?: typeof getDatasets,
    // addDataset?:typeof addDataset,
    // impersonateTo?:typeof impersonateTo,
    // pushState?: reactRouterRedux.IRoutePushAction,
  }
  export interface PropsFromState {
    // currentAccount: Account,
    // loggedInUser: Account,
    // addedDsName: string,
    // fetchingList: boolean,
    // fetchingListError: string,
    // datasets : Datasets,
    // nextPage:string,
    resourceDescriptions: ResourceDescriptions;
    fetchingResources: boolean;
  }
  export interface State {
    // modalShown: boolean
  }
  export type Props = DispatchProps & PropsFromState;
}

const styles = require("./style.scss");

// @(connect as any)(mapStateToProps, {getMatchingIris,getResourceDescription,fetchLabel,fetchShapes})
class Home extends React.PureComponent<Home.Props, any> {

  render() {
    // const {resourceDescriptions, labels,fetchLabel, matchingIris} = this.props
    const renderDescriptions = () => {
      if (this.props.resourceDescriptions.size === 0) {
        // const arr:any = []
        // for (var key in resourceDescriptions) {
        //   if (resourceDescriptions[key] && resourceDescriptions[key].length) arr.push(<ResourceDescription fetchLabel={fetchLabel} className={styles.description} key={key} labels={labels} forIri={key} statements={resourceDescriptions[key]}/>)
        // }
        // if ((_.isEmpty(resourceDescriptions) || _.isEmpty(matchingIris) ) && !this.props.gettingMatchingIris && this.props.fetchingResourceDescriptions === 0) {
        //   return <div className="whiteSink" style={{textAlign:'center'}}>Could not find any data that matches your criteria</div>
        // } else {
        //   return arr
        // }
        return "no descriptions found...";
      }
      // return this.props.resourceDescriptions.mapEntries((forIri, statements) => <ResourceDescription statements={statements} forIri={forIri}/>)
      return this.props.resourceDescriptions.entrySeq().map(([forIri,statements]) => <ResourceDescription key={forIri} tree={getStatementsAsTree(forIri, statements)}/>)
    };

    return (
      <div className={styles.home}>
        {renderDescriptions()}
      </div>
    );
  }
}

export default connect<GlobalState, Home.PropsFromState, Home.DispatchProps, {}>(
  (state, ownProps) => {
    return {
      resourceDescriptions: state.statements.resourceDescriptions,
      fetchingResources: state.statements.fetchRequests > 0
    };
  },
  //dispatch
  {}
)(Home);
