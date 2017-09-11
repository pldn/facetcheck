//external dependencies
import * as React from "react";
import * as getClassName from "classnames";

import {
  TermLiteralBoolean,
  TermLiteralDefault,
  TermLiteralString,
  TermLiteralWktLeaflet,
  TermLiteralWktSvg,
  TermLiteralNumeric,
  TermLiteralImage,
  TermLiteralLink
} from "components";
import * as styles from "./style.scss";
// import * as rowStyles from "components/TriplesTable/style.scss";

export namespace TermLiteral {
  export interface Props {
    className?: string;
    termType: "NamedNode" | "BlankNode" | "Literal" | "Graph";
    value: string;
    language?: string;
    datatype?: string;
  }
  export interface State {
    showAll: boolean;
  }

  //Hacky interface so we can define a static function in an interface
  export interface TermLiteralRenderer {
    new (props?: TermLiteral.Props): React.PureComponent<TermLiteral.Props, any>;
    shouldRender(props: TermLiteral.Props): boolean;
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
    const { className, datatype, language } = this.props;
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
