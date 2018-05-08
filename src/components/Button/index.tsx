//external dependencies
import * as React from "react";

import * as getClassName from "classnames";
//import own dependencies
import {} from "components";
namespace Button {
  export interface Props extends React.HTMLProps<any> {
    href?: string;
    disabled?: boolean;
    active?: boolean;

    //button variants
    primary?: boolean;
    warning?: boolean;
    danger?: boolean;
    info?: boolean;
    success?: boolean;
    neutral?: boolean;
    inverse?: boolean;

    type?: "button" | "file";

    //sizes
    lg?: boolean;
    md?: boolean;
    sm?: boolean;
    xs?: boolean;

    //if button is a file input el, we want to support webkitdirectory as well for selecting dirs
    //need to translate this prop to:
    //// directory
    // mozdirectory, directory, webkitdirectory and nwdirectory allowdirs
    //this is only allowed in react 16 (15 will return errors when assigning unrecognized attrs to dom elements)
    directory?: boolean;
  }
}

import * as styles from "./style.scss";

class Button extends React.PureComponent<Button.Props, any> {
  static defaultProps: Partial<Button.Props> = {
    active: false,
    disabled: false,
    type: "button"
  };
  render() {
    const {
      href,
      disabled,
      active,
      primary,
      warning,
      danger,
      info,
      success,
      inverse,
      neutral,
      lg,
      md,
      sm,
      xs,
      type,
      className,
      children,
      ...remainingProps
    } = this.props;

    const activeClassNames: { [className: string]: boolean } = {
      [styles.btn]: true,
      [className]: !!className,
      [styles.disabled]: !!disabled,
      [styles.active]: !!active,

      //Sizes
      [styles.lg]: !!lg,
      [styles.sm]: !!sm,
      [styles.xs]: !!xs,

      //Variants
      [styles.primary]: primary && !inverse,
      [styles.primaryInverse]: primary && inverse,
      [styles.info]: info && !inverse,
      [styles.infoInverse]: info && inverse,
      [styles.success]: success,
      [styles.warning]: warning,
      [styles.danger]: danger,
      [styles.neutral]: neutral
    };
    if (type === "file") {
      return (
        <label className={getClassName(activeClassNames)}>
          {children} <input {...remainingProps} style={{ display: "none" }} type="file" hidden />
        </label>
      );
    } else {
      return (
        <button className={getClassName(activeClassNames)} {...remainingProps}>
          {children}
        </button>
      );
    }
  }
}

export default Button;
