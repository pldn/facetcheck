//external dependencies
import * as React from 'react';

import * as Helmet from 'react-helmet';
import * as reactRouterRedux from 'react-router-redux';
import { asyncConnect, IAsyncConnect } from 'redux-connect';
import { connect , MapDispatchToPropsObject} from 'react-redux';
import * as getClassName from 'classnames'
// import {ActionCreator} from 'redux';

//import own dependencies
// import { shouldLoadAuth, load as loadAuth, logout} from 'redux/modules/auth';
// import {Account} from 'redux/modules/accounts'
import {getPageMetadata} from 'redux/modules/config'
import {getSubclassRelations,fetchShapes} from 'redux/modules/schema'
import {getMatchingIris} from 'redux/modules/facets'
import {getResourceDescription} from 'redux/modules/viewer'
import {IGlobalState} from 'redux/modules/index';



export interface IAppProps  {
  head: Helmet.Helmet.HelmetProps,
  children?: React.ReactNode,
  // user?: Account,
  appClassName: string,
  logout?: Function,
  pushState?: reactRouterRedux.PushAction
}


const mapStateToProps = (state:IGlobalState) => ({
  // user: state.auth.user,
  head: getPageMetadata(state.config.config),
  appClassName: state.app.className
} as IAppProps);

const mapDispatchToProps:MapDispatchToPropsObject = {pushState: reactRouterRedux.push};

const styles = require('./style.scss')
@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    return dispatch(getSubclassRelations())
        .then(() => dispatch(getMatchingIris(getState().facets)))
        .then(() => dispatch(fetchShapes(getState().schema.shapes, getState().facets)))
        .then(() => {
          const state:IGlobalState = getState();
          const promises:Promise<any>[] = [];
          state.facets.matchingIris.forEach((iri) => {
            if (state.viewer.resourceDescriptions[iri] === undefined) promises.push(dispatch(getResourceDescription(iri)));
          })
          return Promise.all(promises)
        })
  }
} as IAsyncConnect<any>])
@(connect as any)(mapStateToProps, mapDispatchToProps)
export default class App extends React.PureComponent<IAppProps,any> {


  render() {
    const {appClassName,head} = this.props;
    const activeStyles = {
      [styles.app]: !!styles.home,
      [appClassName]: !!appClassName,
    }
    return (
      <div className={getClassName(activeStyles)}>
        <Helmet {...head}/>
        {this.props.children}
      </div>
    );
  }
}
