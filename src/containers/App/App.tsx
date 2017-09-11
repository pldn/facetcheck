//external dependencies
import * as React from "react";

import { Helmet } from "react-helmet";
import * as reactRouterRedux from "react-router-redux";
import { asyncConnect, IAsyncConnect } from "redux-connect";
import { connect } from "react-redux";
import * as getClassName from "classnames";
// import {ActionCreator} from 'redux';

//import own dependencies
// import { shouldLoadAuth, load as loadAuth, logout} from 'reducers/auth';
// import {Account} from 'reducers/accounts'
import { getPageMetadata } from "reducers/config";
// import {getSubclassRelations,fetchShapes} from 'reducers/schema'
// import {getMatchingIris} from 'reducers/facets'
import { getStatements } from "reducers/statements";
import { GlobalState } from "reducers";

namespace App {
  export interface DispatchProps {
    pushState: Function;
  }
  export interface PropsFromState {
    head: Helmet.HelmetProps;
    appClassName: string;
  }
  export interface State {
    // modalShown: boolean
  }
  export type Props = DispatchProps & PropsFromState;
}

const styles = require("./style.scss");
@asyncConnect([
  {
    promise: ({ store: { dispatch, getState } }) => {
      return dispatch(getStatements("https://cultureelerfgoed.nl/id/monument/511321"));
      // return dispatch(getSubclassRelations())
      //     .then(() => dispatch(getMatchingIris(getState().facets)))
      //     .then(() => dispatch(fetchShapes(getState().schema.shapes, getState().facets)))
      //     .then(() => {
      //       const state:GlobalState = getState();
      //       const promises:Promise<any>[] = [];
      //       state.facets.matchingIris.forEach((iri) => {
      //         if (state.viewer.resourceDescriptions[iri] === undefined) promises.push(dispatch(getResourceDescription(iri)));
      //       })
      //       return Promise.all(promises)
      //     })
    }
  } as IAsyncConnect<any>
])
class App extends React.PureComponent<App.Props, App.State> {
  render() {
    const { appClassName, head } = this.props;
    const activeStyles = {
      [styles.app]: !!styles.home,
      [appClassName]: !!appClassName
    };
    return (
      <div className={getClassName(activeStyles)}>
        <Helmet {...head} />
        {this.props.children}
      </div>
    );
  }
}

export default connect<GlobalState, App.PropsFromState, App.DispatchProps, any>(
  state => ({
    head: getPageMetadata(),
    appClassName: state.app.className
  }),
  //dispatch
  {
    pushState: reactRouterRedux.push
  }
)(App);
