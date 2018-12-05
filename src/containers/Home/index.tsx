//external dependencies
import * as React from "react";
//import own dependencies
import { ResourceDescription, Button,Alert } from "../../components";
import * as getClassName from "classnames";
import { connect } from "react-redux";
import { GlobalState } from "../../reducers";
import { getMatchingIris, FacetState } from "../../reducers/facets";
import { ResourceDescriptions, Errors } from "../../reducers/statements";
import { ErrorPage } from "../";
declare namespace Home {
  export interface DispatchProps {
    showMore: typeof getMatchingIris;
  }
  export interface OwnProps{

  }
  export interface PropsFromState {
    resourceDescriptions: ResourceDescriptions;
    fetchingResources: boolean;
    error: string;
    resourceDescriptionErrors: Errors;
    fetchingMatchingIris: boolean;
    selectedClass: string;
    hasNextPage: boolean;
    loadingNextPage: boolean;
    facets: FacetState["facets"];
    nextPageOffset: number;
  }
  export interface State {
    error: string;
  }
  export type Props = DispatchProps & PropsFromState;
}

import * as styles from "./style.module.scss"

// @(connect as any)(mapStateToProps, {getMatchingIris,getResourceDescription,fetchLabel,fetchShapes})
class Home extends React.PureComponent<Home.Props, Home.State> {
  state: Home.State = { error: null };
  renderFullSizeWidgets() {
    if (this.props.resourceDescriptions.size === 0 && this.props.resourceDescriptionErrors.size === 0) {
      if (this.props.fetchingResources) {
        return (
            // <i style={{ fontSize: 40 }} className="far fa-cog fa-spin" />
            <i style={{ fontSize: 40 }} className="far fa-cog fa-spin" />
        );
      }
      return (
          <div className={"whiteSink"}>No descriptions matched your criteria</div>
      );
    }
  }
  renderDescriptions() {
    var els: any[] = [];

    if (this.props.resourceDescriptionErrors.size) {
      this.props.resourceDescriptionErrors.entrySeq().forEach(([forIri, error]) => {
        els.push(
          <Alert key={forIri} severity="error">
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
    return els;
  }
  componentDidCatch(e: Error) {
    this.setState({ error: e.message });
  }
  showMore = () => this.props.showMore(this.props.facets, this.props.selectedClass, this.props.nextPageOffset);
  render() {
    if (this.state.error || this.props.error) {
      return <ErrorPage title="Something went wrong" message={this.state.error || this.props.error} />;
    }

    const fullSizeWidgets = this.renderFullSizeWidgets();
    if (fullSizeWidgets) return <div className={styles.messages}>{fullSizeWidgets}</div>
    const descriptions = this.renderDescriptions();
    return (
      <div>
        <div className={getClassName(styles.home)}>{descriptions}</div>
        <div className={getClassName(styles.buttons, { [styles.hasNextPage]: this.props.hasNextPage })}>
          <Button primary disabled={this.props.loadingNextPage} onClick={this.showMore}>
            {/* Show more {this.props.loadingNextPage && <i className={"fa fa-cog fa-spin"} />} */}
            Show more {this.props.loadingNextPage && <i className={"far fa-cog fa-spin"} />}
          </Button>
        </div>
      </div>
    );
  }
}

export default connect<Home.PropsFromState,Home.DispatchProps, Home.OwnProps, GlobalState>(
  (state, _ownProps) => {
    return {
      hasNextPage: state.facets.hasNextPage,
      resourceDescriptions: state.statements.resourceDescriptions,
      fetchingResources: state.statements.fetchRequests > 0,
      error: state.statements.getMatchingIrisError,
      resourceDescriptionErrors: state.statements.errors,
      fetchingMatchingIris: state.facets.fetchResources > 0,
      selectedClass: state.facets.selectedClass,
      facets: state.facets.facets,
      nextPageOffset: state.facets.nextPageOffset,
      loadingNextPage: state.facets.fetchResources > 0
    };
  },
  //dispatch
  {
    showMore: getMatchingIris
  }
)(Home);
