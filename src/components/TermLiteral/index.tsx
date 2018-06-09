//external dependencies
import * as React from "react";
import * as getClassName from "classnames";
import Tree from '../../helpers/Tree'
import * as nTriply from '@triply/triply-node-utils/build/src/nTriply'
import {
  TermLiteralBoolean,
  TermLiteralDefault,
  TermLiteralString,
  TermLiteralWktLeaflet,
  TermLiteralWktSvg,
  TermLiteralNumeric,
  TermLiteralImage,
  TermLiteralLink,
  TermLiteralHtml,
  TermLiteralTextarea
} from "../";
import * as styles from "./style.scss";
import {RenderConfiguration} from '../../reducers/statements'
// import * as rowStyles from "../"/TriplesTable/style.scss";

export namespace TermLiteral {
  export interface Props {
    className?: string;
    config?:RenderConfiguration
    selectedClass:string
    value: Tree
  }
  export interface State {
    showAll: boolean;
  }
  export type WidgetIdentifiers = 'LiteralString' | 'LiteralTextarea' | 'LiteralBoolean' | 'LiteralWktLeaflet' | 'LiteralWktSvg' | 'LiteralNumeric' | 'LiteralImage' | 'LiteralLink' | 'LiteralDefault'
  //Hacky interface so we can define a static function in an interface
  export interface TermLiteralRenderer {
    new (props?: TermLiteral.Props): React.PureComponent<TermLiteral.Props, any>;
    shouldRender(props: TermLiteral.Props): boolean;
    WidgetName:WidgetIdentifiers
  }
}

/**
 * Order matters! I.e., recommend the last one is a catch-all
 */

//used for e.g. IRIs and graphnames
export class TermLiteral extends React.PureComponent<TermLiteral.Props, TermLiteral.State> {
  LiteralRenderers: [TermLiteral.TermLiteralRenderer];
  //used by subcomponents, so we can have an 'implements' interface that has static methods
  static staticImplements<T>() {
    return (constructor: T) => {};
  }
  constructor(props: any) {
    super(props);
    this.LiteralRenderers = [
      TermLiteralString,
      TermLiteralHtml,//should be before text area (more specific)
      TermLiteralTextarea,
      TermLiteralBoolean,
      TermLiteralWktLeaflet,
      TermLiteralNumeric,
      TermLiteralImage,
      TermLiteralLink,
      TermLiteralDefault
    ];
    this.state = {
      showAll: false
    };
  }

  renderLiteral() {
    for (const Renderer of this.LiteralRenderers) {
      if (Renderer.shouldRender(this.props)) return <Renderer {...this.props} />;
    }
    return null;
  }

  render() {
    const { className } = this.props;
    return (
      <div className={getClassName(className, styles.wrapper)}>
        {this.renderLiteral()}
        {
        // <div>
        //   {language
        //     ? <span className={getClassName(styles.language, rowStyles.rowHover)}>
        //         @{language}
        //       </span>
        //     : <a
        //         href={datatype}
        //         className={getClassName(styles.extLink, rowStyles.rowHover)}
        //         target="_blank"
        //         title={"Open external link in new window"}
        //       >
        //         {datatype}
        //       </a>}
        // </div>
      }
      </div>
    );
  }
}
export default TermLiteral;
