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
        const { promise, types } = action;
        const rest = _.omit(action, ["promise, types"]);
        // const {promise, types, ...rest} = action; // eslint-disable-line no-redeclare
        if (!promise) {
          return next(action);
        }
        const [REQUEST, SUCCESS, FAILURE] = types;
        next(_.assign({}, rest, { type: REQUEST }));
        const actionPromise = promise(client);
        actionPromise
          .then(
            (result: any) => {
              if (result && result.body && result.meta) {
                //this promise comes from our API client
                next(_.assign({}, rest, { result: result.body, meta: result.meta, type: SUCCESS }));
              } else {
                next(_.assign({}, rest, { result: result, type: SUCCESS }));
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
