//external dependencies
import * as React from "react";
import getClassName from "classnames";
import Tree from '../../helpers/Tree'
import {
  TermLiteralBoolean,
  TermLiteralDefault,
  TermLiteralString,
  TermLiteralWktLeaflet,
  TermLiteralNumeric,
  TermLiteralImage,
  TermLiteralLink,
  TermLiteralHtml,
  TermLiteralTextarea
} from "../";
import * as styles from "./style.module.scss";
import {RenderConfiguration} from '../../reducers/statements'
// import * as rowStyles from "../"/TriplesTable/style.scss";

export declare namespace TermLiteral {
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
  LiteralRenderers: Array<TermLiteral.TermLiteralRenderer>;
  //used by subcomponents, so we can have an 'implements' interface that has static methods
  static staticImplements<T>() {
    return (_constructor: T) => {};
  }
  constructor(props: any) {
    super(props);
    this.LiteralRenderers = [
      TermLiteralHtml,//should be before text area (more specific)
      TermLiteralTextarea,
      TermLiteralString,
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
