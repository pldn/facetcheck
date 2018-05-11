//external dependencies
import * as React from "react";

import { Helmet } from "react-helmet";
import * as reactRouterRedux from "react-router-redux";

import {ErrorPage} from '../'
import { connect } from "react-redux";
import * as getClassName from "classnames";
// import {ActionCreator} from 'redux';

//import own dependencies

// import {getSubclassRelations,fetchShapes} from 'reducers/schema'
import {  refreshFacets,FacetState } from "../../reducers/facets";
import { GlobalState } from "../../reducers";

namespace App {
  export interface DispatchProps {
    pushState: Function;
    refreshFacets: typeof refreshFacets
  }
  export interface PropsFromState {
    appClassName: string;
    globalErr:string
    facetLabels: FacetState['facetLabels'],
    selectedClass: string
  }
  export interface State {
    error:string
    // modalShown: boolean
  }
  export type Props = DispatchProps & PropsFromState;
}

const styles = require("./style.scss");
// @asyncConnect([
//   {
//     promise: ({ store: { dispatch, getState } }) => {
//       const state:GlobalState = getState();
//       return Promise.all([dispatch(refreshFacets(state.facets.facetLabels, state.facets.selectedClass))]);
//     }
//   } as IAsyncConnect<any>
// ])
class App extends React.PureComponent<App.Props, App.State> {
  state:App.State = { error:null}
  componentDidCatch(e:Error) {
    this.setState({error: e.message})
  }
  componentWillMount() {
    this.props.refreshFacets(this.props.facetLabels, this.props.selectedClass)
  }
  render() {
    const { appClassName } = this.props;
    const activeStyles = {
      [styles.app]: !!styles.home,
      [appClassName]: !!appClassName
    };
    var mainComponent:any = null
    if (this.state.error) {
      mainComponent = <ErrorPage title="Something went wrong" message={this.state.error}/>
    } else if (this.props.globalErr) {
      mainComponent = <ErrorPage title="Something went wrong" message={this.props.globalErr}/>
    } else {
      mainComponent = this.props.children
    }
    const head = {
    htmlAttributes: {
      lang: "en"
    },
    titleTemplate: "%s - FacetCheck",
    defaultTitle: "FacetCheck",
    meta: [
      { name: "description", content: "FacetCheck" },
      { charset: "utf-8" },
      { property: "og:site_name", content: "FacetCheck" },
      // {property: 'og:image', content: clientConfig.branding.logo},
      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: "FacetCheck" },
      { property: "og:description", content: "FacetCheck" },
      { property: "og:site", content: "FacetCheck" },
      { property: "og:creator", content: "triply.cc" }
    ]
  }
    return (
      <div className={getClassName(activeStyles)}>
        <Helmet {...head} />
        {mainComponent}
      </div>
    );
  }
}

export default connect<GlobalState, App.PropsFromState, App.DispatchProps, any>(
  state => ({
    appClassName: state.app.className,
    globalErr:state.app.globalErr,
    selectedClass: state.facets.selectedClass,
    facetLabels: state.facets.facetLabels
  }),
  //dispatch
  {
    pushState: reactRouterRedux.push,
    refreshFacets: refreshFacets
  }
)(App);
