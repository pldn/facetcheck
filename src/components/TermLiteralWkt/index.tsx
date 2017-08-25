//external dependencies
import * as React from "react";
import * as _ from "lodash";
const parse = require("wellknown");

import { TermLiteral, TermLiteralDefault } from "components";
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
class TermLiteralWkt extends React.PureComponent<TermLiteral.Props, any> {
  static shouldRender(props: TermLiteral.Props) {
    return wkt.indexOf(props.datatype) >= 0;
  }
  getBorders(poly: Array<Coords>) {
    const x = poly.map(c => c[0]);
    const y = poly.map(c => c[1]);
    return {
      minX: _.min(x),
      minY: _.min(y),
      maxX: _.max(x),
      maxY: _.max(y)
    };
  }
  getPolySVG(poly: Array<Coords>): Svg {
    poly = poly.map(c => [c[0], -c[1]] as Coords);
    const { minX, minY, maxX, maxY } = this.getBorders(poly);
    const points = poly.map(c => c.join(", ")).join(" ");
    return { points, minX, minY, maxX, maxY };
  }
  polygon(wkt: any) {
    //first array is outer poly, subsequent arrays are holes
    const svg = this.getPolySVG(wkt.coordinates[0]);
    const width = svg.maxX - svg.minX;
    const height = svg.maxY - svg.minY;

    const svgProps: { viewBox: string; width?: number; height?: number } = {
      viewBox: `${svg.minX} ${svg.minY} ${width} ${height}`
    };
    svgProps[width > height ? "width" : "height"] = 48;

    return (
      <div className={styles.svg}>
        <svg {...svgProps}>
          <polygon points={svg.points} />
        </svg>
      </div>
    );
  }
  multiPolygon(wkt: any) {
    const svgs: Array<Svg> = wkt.coordinates.map((poly: any) => this.getPolySVG(poly[0]));

    const minX = _.min(svgs.map(s => s.minX));
    const minY = _.min(svgs.map(s => s.minY));
    const maxX = _.max(svgs.map(s => s.maxX));
    const maxY = _.max(svgs.map(s => s.maxY));
    const width = maxX - minX;
    const height = maxY - minY;

    const svgProps: { viewBox: string; width?: number; height?: number } = {
      viewBox: `${minX} ${minY} ${width} ${height}`
    };
    svgProps[width > height ? "width" : "height"] = 48;

    return (
      <div className={styles.svg}>
        <svg {...svgProps}>
          {svgs.map((svg, k) => <polygon key={k} points={svg.points} />)}
        </svg>
      </div>
    );
  }
  renderImage() {
    const wkt = parse(this.props.value);
    if (!wkt) return;

    if (wkt.type === "Polygon") return this.polygon(wkt);
    if (wkt.type === "MultiPolygon") return this.multiPolygon(wkt);
  }

  render() {
    return (
      <div>
        {this.renderImage()}
        <TermLiteralDefault {...this.props} />
      </div>
    );
  }
}
export default TermLiteralWkt;
