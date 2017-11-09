//external dependencies
import * as React from "react";
import * as _ from "lodash";
const languageTags = require("language-tags");

import { TermLiteral, TermLiteralDefault } from "components";

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export /* this statement implements both normal interface & static interface */
class TermLiteralString extends React.PureComponent<TermLiteral.Props, any> {
  tags: { language: string; script: string; region: string; regionCode: string };

  constructor(props: TermLiteral.Props) {
    super(props);
    this.tags = this.parseTags(props.value.getTerm().language);
    this.state = {
      imageSource: this.getSource(this.tags.regionCode)
    };
  }
  static shouldRender(props: TermLiteral.Props) {
    return props.value.getTerm().datatype === "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
  }
  static WidgetName: 'LiteralString'
  getSource(regionCode: string) {
    if (regionCode)
      return `https://d2salfytceyqoe.cloudfront.net/wp-content/plugins/sitepress-multilingual-cms/res/flags/${regionCode.toLowerCase()}.png`;
  }
  parseTags(languageTag: string) {
    const tags = languageTags(languageTag);
    const language = tags && tags.language();
    const region = tags && tags.region();
    const script = language && language.script();
    return {
      language: language && language.descriptions().join(", "),
      script: script && script.descriptions().join(", "),
      region: region && region.descriptions().join(", "),
      regionCode: region && region.format()
    };
  }
  imageError(e: any) {
    this.setState({ imageSource: null });
  }
  getTitle() {
    return _.reduce(
      this.tags,
      (r, v, k) => {
        if (k !== "regionCode" && v) r.push(`${_.capitalize(k)}: ${v}`);
        return r;
      },
      [] as any
    ).join("\n");
  }
  render() {
    const { imageSource } = this.state;
    return (
      <div>
        {imageSource &&
          <div style={{ float: "left", display: "flex", paddingTop: 4, paddingRight: 4 }}>
            <img src={imageSource} onError={this.imageError.bind(this)} />
          </div>}
        <div title={this.getTitle()}>
          <TermLiteralDefault {...this.props} />
        </div>
      </div>
    );
  }
}
export default TermLiteralString;
