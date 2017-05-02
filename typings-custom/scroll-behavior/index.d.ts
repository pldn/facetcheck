

declare module "scroll-behavior/lib/useStandardScroll" {
  import { Router, browserHistory } from 'react-router';
    // import BrowserHistory = require('react-router/lib/browserHistory')
    import ReactRouter = require('react-router')

    // import BrowserHistory = require("react-router/lib/browserHistory");
    // ReactRouter.browserHistory
    // function useStandardScroll(callback:Function):ReactRouter.BrowserHistory;
    // function useStandardScroll(callback:() => ReactRouter.HistoryBase):ReactRouter.HistoryBase;
    function useStandardScroll(callback:() => any):() => ReactRouter.HistoryBase;

    namespace useStandardScroll{}

    export = useStandardScroll;

}
