//external dependencies
import * as React from "react";

import { Helmet,HelmetProps } from "react-helmet";

import { ErrorPage } from "../";
import { connect } from "react-redux";
import * as getClassName from "classnames";
// import {ActionCreator} from 'redux';

//import own dependencies

// import {getSubclassRelations,fetchShapes} from 'reducers/schema'
import { refreshFacets, FacetState } from "../../reducers/facets";
import { GlobalState } from "../../reducers";
import { getFacetcheckTitle, getFavIcon } from "../../facetConf";
import {Home, Nav} from '../'
declare namespace App {
  export interface DispatchProps {
    refreshFacets: typeof refreshFacets;
  }
  export interface PropsFromState {
    appClassName: string;
    globalErr: string;
    facetLabels: FacetState["facetLabels"];
    selectedClass: string;
  }
  export interface OwnProps {
  }
  export interface State {
    error: string;
    // modalShown: boolean
  }
  export type Props = DispatchProps & PropsFromState;
}

import * as styles from "./style.module.scss"
class App extends React.PureComponent<App.Props, App.State> {
  state: App.State = { error: null };
  componentDidCatch(e: Error) {
    this.setState({ error: e.message });
  }
  componentWillMount() {
    this.props.refreshFacets(this.props.facetLabels, this.props.selectedClass);
  }
  render() {
    const { appClassName } = this.props;
    const activeStyles = {
      [styles.app]: !!styles.home,
      [appClassName]: !!appClassName
    };
    var mainComponent: any = null;
    if (this.state.error) {
      mainComponent = <ErrorPage title="Something went wrong" message={this.state.error} />;
    } else if (this.props.globalErr) {
      mainComponent = <ErrorPage title="Something went wrong" message={this.props.globalErr} />;
    } else {
      mainComponent = <Nav><Home/></Nav>;
    }
    const title = getFacetcheckTitle();
    const head:HelmetProps = {
      htmlAttributes: {
        lang: "en"
      },
      titleTemplate: `%s - ${title}`,
      defaultTitle: title,

      meta: [
        { name: "description", content: title },
        { charset: "utf-8" },
        { property: "og:site_name", content: title },
        // {property: 'og:image', content: clientConfig.branding.logo},
        { property: "og:locale", content: "en_US" },
        { property: "og:title", content: title },
        { property: "og:description", content: title },
        { property: "og:site", content: title },
        { property: "og:creator", content: "triply.cc" }
      ]
    };
    const favIcon = getFavIcon();
    return (
      <div className={getClassName(activeStyles)}>
        <Helmet {...head} >
          {favIcon && <link rel="shortcut icon" type="image/png" href={favIcon}/>}
        </Helmet>
        {mainComponent}
      </div>
    );
  }
}

export default connect<App.PropsFromState, App.DispatchProps, App.OwnProps, GlobalState>(
// export default connect<GlobalState, App.PropsFromState, App.DispatchProps, any>(
  state => ({
    appClassName: state.app.className,
    globalErr: state.app.globalErr,
    selectedClass: state.facets.selectedClass,
    facetLabels: state.facets.facetLabels
  }),
  //dispatch
  {
    refreshFacets: refreshFacets
  }
)(App);
