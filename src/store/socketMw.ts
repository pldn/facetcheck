import SocketClient from "helpers/SocketClient";
import { Store } from "redux";
import * as _ from "lodash";
import { GlobalState } from "reducers";
export default function socketMiddleware(socketClient: SocketClient) {
  // Socket param is the client. We'll show how to set this up later.
  return (store: Store<GlobalState>) => {
    return (next: Function) => (action: any) => {
      if (typeof action === "function") {
        return action(store.dispatch, store.getState);
      }
      if (action instanceof Promise) return; //just skip. This is probably a return value of the promise mw
      /*
       * Socket middleware usage.
       * promise: (socket) => socket.emit('MESSAGE', 'hello world!')
       * type: always 'socket'
       * types: [REQUEST, SUCCESS, FAILURE]
       */
      // const { promise, type, types, ...rest } = action;
      if (!action.socket) return next(action);
      const { socket, types } = action;
      const rest = _.omit(action, ["socket", "types"]);
      if (!socket) {
        console.info("not a socket: ", action);
        // Move on! Not a socket request or a badly formed one.
        return next(action);
      }
      if (!types && !action.type) {
        //A badly formed action, just continue
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types || (<any>[]);
      if (REQUEST) next(_.assign({}, rest, { type: REQUEST }));

      const mwResult = socket(socketClient);

      if (mwResult instanceof Promise && types) {
        mwResult
          .then((result: any) => {
            return next(_.assign({}, rest, result, { type: SUCCESS }));
          })
          .catch((error: any) => {
            return next(_.assign({}, rest, error, { type: FAILURE }));
          });
      } else {
        //we didnt get a promise as a response. Perhaps we just added a listener
        //or something (which is synchronous). Just continue
        return next(action);
      }
    };
  };
}
