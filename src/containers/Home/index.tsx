//external dependencies
import * as React from 'react';
import * as _ from 'lodash'
import * as Helmet from 'react-helmet';
import * as getClassName from 'classnames'
import {formValueSelector} from 'redux-form'
//import own dependencies
// import {State as LabelsState, fetchLabel} from 'reducers/labels'
import {Grid, Row, Col, Button} from 'react-bootstrap';
import * as N3 from 'n3'
import {
  ResourceDescription,
  Svg,
} from 'components';

import { connect } from 'react-redux';
import {GlobalState} from 'reducers';
// import {getResourceDescription,Statement} from 'reducers/viewer';
// import {fetchShapes, Shapes} from 'reducers/schema';
// import {State as FacetState,getMatchingIris, facetsChanged,matchingIrisChanged} from 'reducers/facets';

module Home {
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
    }
    export interface State {
      // modalShown: boolean
    }
    export type Props = DispatchProps & PropsFromState
}


const styles = require('./style.scss');

// @(connect as any)(mapStateToProps, {getMatchingIris,getResourceDescription,fetchLabel,fetchShapes})
class Home extends React.PureComponent<Home.Props,any> {


  componentWillReceiveProps(nextProps:Home.Props) {
    //Refetch matching IRIs when one of the facets change
    // if (facetsChanged(this.props.facets, nextProps.facets)) {
    //   this.props.getMatchingIris(nextProps.facets);
    //   this.props.fetchShapes(this.props.shapes, nextProps.facets);//will only fetch if needed
    //   // this.props.fetchShapeCounts(this.props.shapeCounts);
    // }
    // //Get resource descriptions if needed
    // if (
    //   //just fetched matching IRIs
    //   (this.props.gettingMatchingIris && !nextProps.gettingMatchingIris)
    // ) {
    //   nextProps.matchingIris.forEach((iri) => {
    //
    //     if (this.props.resourceDescriptions[iri] === undefined) this.props.getResourceDescription(iri);
    //   })
    // }
  }
  render() {
    // const {resourceDescriptions, labels,fetchLabel, matchingIris} = this.props
    const renderDescriptions = () => {
      const arr:any = []
      // for (var key in resourceDescriptions) {
      //   if (resourceDescriptions[key] && resourceDescriptions[key].length) arr.push(<ResourceDescription fetchLabel={fetchLabel} className={styles.description} key={key} labels={labels} forIri={key} statements={resourceDescriptions[key]}/>)
      // }
      // if ((_.isEmpty(resourceDescriptions) || _.isEmpty(matchingIris) ) && !this.props.gettingMatchingIris && this.props.fetchingResourceDescriptions === 0) {
      //   return <div className="whiteSink" style={{textAlign:'center'}}>Could not find any data that matches your criteria</div>
      // } else {
      //   return arr
      // }
      return 'descriptions!'
    }

    return (
      <div className={styles.home}>
        {renderDescriptions()}
      </div>
    );
  }
}


export default connect<GlobalState, Home.PropsFromState, Home.DispatchProps, {}>(
  (state,ownProps) => {
    return {
    }
  },
  //dispatch
  {
  }
)(Home)
