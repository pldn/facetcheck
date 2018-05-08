//external dependencies
import * as React from "react";
//import own dependencies
import { ResourceDescription, Button } from "../../components";
import * as getClassName from "classnames";
import { connect } from "react-redux";
import { GlobalState } from "../../reducers";
import { getMatchingIris, FacetState } from "../../reducers/facets";
import { Alert } from "react-bootstrap";
import { ResourceDescriptions, Errors, getStatementsAsTree } from "../../reducers/statements";

namespace Home {
  export interface DispatchProps {
    showMore: typeof getMatchingIris;
  }
  export interface PropsFromState {
    resourceDescriptions: ResourceDescriptions;
    fetchingResources: boolean;
    error: string;
    resourceDescriptionErrors: Errors;
    fetchingMatchingIris: boolean;
    selectedClass: string;
    hasNextPage: boolean;
    facets: FacetState["facets"];
    nextPageOffset: number;
  }
  export interface State {
    // modalShown: boolean
  }
  export type Props = DispatchProps & PropsFromState;
}

const styles = require("./style.scss");

// @(connect as any)(mapStateToProps, {getMatchingIris,getResourceDescription,fetchLabel,fetchShapes})
class Home extends React.PureComponent<Home.Props, any> {
  isSingleCol():boolean {
    if (this.props.resourceDescriptionErrors.size) return true;
  }
  renderDescriptions = () => {
    if (this.props.error) {
      return <Alert bsStyle="danger">{this.props.error}</Alert>;
    }
    var els: any[] = [];

    if (this.props.resourceDescriptionErrors.size) {
      this.props.resourceDescriptionErrors.entrySeq().forEach(([forIri, error]) => {
        els.push(
          <Alert key={forIri} bsStyle="danger">
            <pre>{error}</pre>
          </Alert>
        );
      });
    }
    this.props.resourceDescriptions.entrySeq().forEach(([forIri, statements]) => {
      els.push(
        <ResourceDescription
          key={forIri}
          selectedClass={this.props.selectedClass}
          fetchingMatchingIris={this.props.fetchingMatchingIris}
          statements={statements}
          forIri={forIri}
        />
      );
    });
    if (els.length <= 0) {
      // this.singleCol = true;
      if (this.props.fetchingResources) {
        return (
          <div className={styles.noDescriptionWrapper}>
            <i style={{ fontSize: 40 }} className="fa fa-cog fa-spin" />
          </div>
        );
      }
      return (
        <div className={styles.noDescriptionWrapper}>
          <div className={"whiteSink"}>No descriptions matched your criteria</div>
        </div>
      );
    } else {
      return els;
    }
  };
  render() {
    // const {resourceDescriptions, labels,fetchLabel, matchingIris} = this.props

    const descriptions = this.renderDescriptions();
    return (
      <div>
        <div className={getClassName(styles.home, { [styles.singlePage]: this.isSingleCol() })}>{descriptions}</div>
        <div className={getClassName(styles.buttons, { [styles.hasNextPage]: this.props.hasNextPage })}>
          <Button
            primary
            onClick={() => this.props.showMore(this.props.facets, this.props.selectedClass, this.props.nextPageOffset)}
          >
            Show more
          </Button>
        </div>
      </div>
    );
  }
}

export default connect<GlobalState, Home.PropsFromState, Home.DispatchProps, {}>(
  (state, ownProps) => {
    return {
      hasNextPage: state.facets.hasNextPage,
      resourceDescriptions: state.statements.resourceDescriptions,
      fetchingResources: state.statements.fetchRequests > 0,
      error: state.statements.getMatchingIrisError,
      resourceDescriptionErrors: state.statements.errors,
      fetchingMatchingIris: state.facets.fetchResources > 0,
      selectedClass: state.facets.selectedClass,
      facets: state.facets.facets,
      nextPageOffset: state.facets.nextPageOffset
    };
  },
  //dispatch
  {
    showMore: getMatchingIris
  }
)(Home);
