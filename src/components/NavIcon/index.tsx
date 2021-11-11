import * as React from "react";

import getClassName from "classnames";
import { Svg } from "../";

declare namespace NavIcon {
  export interface Props {
    className?: string;
    clickHandler?: React.MouseEventHandler<any>;
    svg?: string;
    fontIcon?: string; //untested atm,
    title?: string;
    imgOffsetStyle?: React.CSSProperties; //some svgs need to be a little offset
    btnStyle?: React.CSSProperties; //some svgs need to be a little offset
    //because of their layout (e.g. adding some margins)
  }
}
import * as styles from "./style.module.scss";

class NavIcon extends React.PureComponent<NavIcon.Props, any> {
  render() {
    const { className, clickHandler, svg, title, fontIcon, imgOffsetStyle, btnStyle } = this.props;

    const btnClassNames = {
      [styles.navIcon]: !!styles.navIcon,
      resetButton: true
    };
    // const link = '/' + ds.owner.accountName + '/' + ds.name;
    return (
      <div className={getClassName(styles.wrapper, className)}>
        <button
          title={title}
          style={btnStyle ? btnStyle : {}}
          className={getClassName(btnClassNames)}
          onClick={clickHandler ? clickHandler : () => {}}
        >
          {svg && <Svg src={svg} style={imgOffsetStyle} />}
          {fontIcon && <i className={"fa " + fontIcon} />}
        </button>
      </div>
    );
  }
}
export default NavIcon;
