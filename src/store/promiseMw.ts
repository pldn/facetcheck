//external dependencies
import * as _ from "lodash";
import { Middleware, Store } from "redux";
import { GlobalState } from "reducers";
// import {Models} from 'Contract'

//import own dependencies
import ApiClient from "helpers/ApiClient";

var createClientMiddleware = function(client: ApiClient): Middleware {
  return (store: Store<GlobalState>) => {
    return (next: Function) => (action: any) => {

      try {
        if (typeof action === "function") {
          return action(store.dispatch, store.getState);
        }
        if (!action) return
        const { promise, types, ...rest } = action;
        if (!promise || !types || types.length !== 3) {
          if (action instanceof Promise) {
            //hmm, when is an action a promise? just return empty
            return;
          }
          return next(action);
        }
        const [REQUEST, SUCCESS, FAILURE] = types;
        next({...rest, type: REQUEST});
        const actionPromise = promise(client);
        actionPromise
          .then(
            (result: any) => {
              if (result && result.body && result.meta) {
                //this promise comes from our API client
                next({...rest, result: result.body, meta: result.meta, type: SUCCESS});
              } else {
                next({...rest, result: result, type: SUCCESS});
              }
            },
            (error: any) => {
              console.error("ERRR", error);
              next(
                _.assign({}, rest, error, {
                  message: error.message,
                  devMessage: error.serverError,
                  status: error.status,
                  type: FAILURE
                })
              );
            }
          )
          .catch((error: any) => {
            console.error("MIDDLEWARE ERROR:", error, action);
            next(_.assign({}, rest, error, { type: FAILURE }));
          });
        return actionPromise;
      } catch (e) {
        console.error("MIDDLEWARE ERROR:", e, action);
      }
    };
  };
};
export default createClientMiddleware;
