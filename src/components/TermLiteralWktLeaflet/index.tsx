//external dependencies
import * as React from "react";
import * as _ from "lodash";
const parse = require("wellknown");

import { TermLiteral, TermLiteralDefault,Leaflet } from "components";
import * as styles from "./style.scss";

export type Coords = [number, number];
export interface Svg {
  points: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
const wkt = [
  "https://triply.cc/wkt/multiPolygon",
  "https://triply.cc/wkt/polygon",
  "http://www.opengis.net/ont/geosparql#wktLiteral"
];

@TermLiteral.staticImplements<TermLiteral.TermLiteralRenderer>()
export /* this statement implements both normal interface & static interface */
class TermLiteralWktLeaflet extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
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
