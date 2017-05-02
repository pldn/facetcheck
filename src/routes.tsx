//external dependencies
import * as React from 'react';
import {IndexRoute, Route,EnterHook,RouterState} from 'react-router';
import * as _ from 'lodash'

//import own dependencies
import {Store} from 'redux';
// import {
//   shouldLoadAuth,
//   load as loadAuth
// } from 'redux/modules/auth';
// import {Account} from 'redux/modules/accounts'
import { IGlobalState } from 'redux/modules/';
import * as Containers from 'containers';



export default (store:Store<IGlobalState> = null) => {
  type checkFunction = (nextState:RouterState) => string | undefined;
  //This function is only used to check redirects (e.g. to login page)
  //Authentication checking (i.e. hiding a component for non-admins) is done in the components themselves
  function checkRedirect(...checks: checkFunction[]) :EnterHook {
    return function(nextState, replace, cb) {
      function doCheck() {
        const state = store.getState() as IGlobalState;
        _.some(checks, (check) => {
          var shouldRedirect = check(nextState);
          if (shouldRedirect)  {
            replace(shouldRedirect);
            return true;//stops iterating
          }
        })
        cb();
      };

    }
  }


  const state:IGlobalState = store.getState();
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route component={Containers.App}>

      <Route path="/" component={Containers.Nav}>
        <IndexRoute component={Containers.Home}/>
        <Route path="*" component={() => <Containers.ErrorPage title="Not found" message="The page you're looking for does not exist"/>} />

      </Route>
      <Route path="*" component={() => <Containers.ErrorPage title="Not found" message="The page you're looking for does not exist"/>} />
    </Route>


  );
};
