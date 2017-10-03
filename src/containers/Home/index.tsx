//external dependencies
import * as React from "react";
//import own dependencies
import { ResourceDescription } from "components";

import { connect } from "react-redux";
import { GlobalState } from "reducers";
import {Alert} from 'react-bootstrap'
import { ResourceDescriptions,Errors, getStatementsAsTree } from "reducers/statements";


namespace Home {

  export interface DispatchProps {

  }
  export interface PropsFromState {

    resourceDescriptions: ResourceDescriptions;
    fetchingResources: boolean;
    error:string
    resourceDescriptionErrors: Errors,
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
      if (this.props.error) {
        return <Alert bsStyle="danger">{this.props.error}</Alert>
      }
      var els:any[] = [];

      if (this.props.resourceDescriptionErrors.size) {

        this.props.resourceDescriptionErrors.entrySeq().forEach(([forIri,error]) => {
          els.push( <Alert key={forIri} bsStyle="danger"><pre>{error}</pre></Alert>)
        })
      }
      this.props.resourceDescriptions.entrySeq().forEach(([forIri,statements]) => {
          els.push(<ResourceDescription key={forIri} tree={getStatementsAsTree(forIri, statements)}/>)
      })
      if (els.length === 0) {
        return "no descriptions found...";
      } else {
        return els;
      }

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
      fetchingResources: state.statements.fetchRequests > 0,
      error:state.statements.getMatchingIrisError,
      resourceDescriptionErrors: state.statements.errors
    };
  },
  //dispatch
  {}
)(Home);
