// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/9b5329839558a78550bf078c3e5f323c2f0f3b86/react-addons-transition-group/index.d.ts
declare module "react-addons-transition-group" {
  // Type definitions for React (react-addons-transition-group) 0.14
  // Project: http://facebook.github.io/react/
  // Definitions by: Asana <https://asana.com>, AssureSign <http://www.assuresign.com>, Microsoft <https://microsoft.com>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  // TypeScript Version: 2.1

  import { ReactElement, ComponentClass, ReactType, TransitionGroupProps } from "react";

  module "react" {
    export interface TransitionGroupProps extends HTMLAttributes<{}> {
      component?: ReactType;
      className?: string;
      childFactory?: (child: ReactElement<any>) => ReactElement<any>;
    }
  }

  var ReactCSSTransitionGroup: ComponentClass<TransitionGroupProps>;
  export = ReactCSSTransitionGroup;
}
