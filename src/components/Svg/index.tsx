import * as React from "react";
// import BaseComponent from '../../helpers/BaseComponent'
import * as getClassName from "classnames";

/**
IMPORTANT:
Use this SVG for images that are either large, or when they are infrequently used in the website.
SVGs that are small and used frequently, used be used via a sprite, in orde to improve caching.
**/
export interface ISvgProps {
  className?: string;
  // style?: React.CSSProperties,
  src: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  onClick?: React.EventHandler<React.MouseEvent<any>>;
}

const styles = require("./style.scss");
const Svg: React.StatelessComponent<ISvgProps> = (props: ISvgProps) => {
  const { className, src, style, imgStyle, onClick } = props;

  const classNames: { [className: string]: boolean } = {
    [styles.svgStatic]: true,
    [styles.clickable]: !!onClick,
    "svg-static": true
  };
  return (
    <div className={getClassName(className, classNames)} style={style ? style : {}}>
      <img src={src} style={imgStyle ? imgStyle : {}} onClick={onClick} />
    </div>
  );
};

export default Svg;
