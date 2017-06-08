//external dependencies
import {RouteComponentProps} from 'react-router';
import * as reactRouter from 'react-router';

//import own dependencies
export {default as App} from './App/App';
export {default as ErrorPage} from './ErrorPage';
export {default as Home} from './Home';
export {default as Nav} from './Nav';
export {default as Panel} from './Panel';


export interface RouteComponentProps extends reactRouter.RouteComponentProps<any, Object>{}



//just an interface that all other components can extend
export interface IComponentProps extends RouteComponentProps<any,any> {}
