//external dependencies
import * as React from "react";
import * as getClassName from "classnames";
import { extname } from "path";
import { TermLiteral, TermLiteralDefault } from "components";
import * as styles from "./style.scss";

namespace TermLiteralImage {
  export interface State {
    imageLoaded: boolean;
    imageError: boolean;
  }
}

const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".bmp", ".tiff"];
/* this statement implements both normal interface & static interface */
@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
class TermLiteralImage extends React.PureComponent<TermLiteral.Props, TermLiteralImage.State> {
  img: any;

  constructor(props: TermLiteral.Props) {
    super(props);
    this.state = {
      imageLoaded: false,
      imageError: false
    };
  }
  static shouldRender(props: TermLiteral.Props) {
    return props.config.type === 'image'
  }
  componentDidMount() {
    if (!this.state.imageLoaded && this.img.complete) {
      this.img.naturalHeight ? this.onLoad() : this.onError(null);
    }
  }

  onLoad() {
    this.setState({ imageLoaded: true });
  }
  onError(e: any) {
    this.setState({ imageError: true });
  }

  render() {
    const { term, className,config } = this.props;
    const { imageError, imageLoaded } = this.state;
    return (
      <div className={className}>
        {
          // !imageLoaded && !imageError && <i className={getClassName("fa fa-cog fa-spin", styles.spinner)} />
        }
          <img
            ref={el => (this.img = el)}
            src={term.value}
            title={term.value}
            className={!imageError && imageLoaded ? styles.image : styles.hidden}
            onLoad={this.onLoad.bind(this)}
            onError={this.onError.bind(this)}
          />

        {
          // (imageError || !imageLoaded) && <TermLiteralDefault {...this.props} />
        }
      </div>
    );
  }
}
export default TermLiteralImage;
