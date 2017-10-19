//external dependencies
import * as React from "react";
const parse = require("wellknown");

import { TermLiteral, Leaflet } from "components";

const wkt = [
  "https://triply.cc/wkt/multiPolygon",
  "https://triply.cc/wkt/polygon",
  "http://www.opengis.net/ont/geosparql#wktLiteral",
  "http://www.openlinksw.com/schemas/virtrdf#Geometry"
];

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export /* this statement implements both normal interface & static interface */
class TermLiteralWktLeaflet extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return wkt.indexOf(props.term.datatype) >= 0;
  }




  render() {
    const wkt = parse(this.props.term.value);
    if (!wkt) return null;
    return (
      <Leaflet value={this.props.term.value}/>
    );
  }
}
export default TermLiteralWktLeaflet;
