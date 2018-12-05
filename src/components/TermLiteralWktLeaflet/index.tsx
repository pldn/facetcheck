//external dependencies
import * as React from "react";
import {parse} from "wellknown";
import { TermLiteral, Leaflet } from "../";

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
    const term = props.value.getTerm();
    return term.termType === "Literal" && wkt.indexOf(term.datatypeString) >= 0;
  }
static WidgetName:TermLiteral.WidgetIdentifiers = 'LiteralWktLeaflet'



  render() {
    const term = this.props.value.getTerm()

    const wkt = parse(term.value);
    if (!wkt) return null;
    return (
      <Leaflet values={[term.value]}/>
    );
  }
}
export default TermLiteralWktLeaflet;
