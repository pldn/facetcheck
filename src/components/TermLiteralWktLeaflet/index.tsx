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
    console.log(props.datatype)
    return wkt.indexOf(props.datatype) >= 0;
  }




  render() {
    const wkt = parse(this.props.value);
    if (!wkt) return null;
    return (
      <Leaflet value={this.props.value}/>
    );
  }
}
export default TermLiteralWktLeaflet;
