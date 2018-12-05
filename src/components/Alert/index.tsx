//external dependencies
import * as React from "react";
import * as getClassName from "classnames";

//import own dependencies

export interface FormFieldProps {
  className?: string;
  style?: React.CSSProperties;
  message?: string | React.ReactElement<any>;
  transparent?: boolean;
  hideIcon?: boolean;
  size?: "md" | "sm";
  severity?: "error" | "warning" | "info"; //defaults to error
}
import * as styles from "./style.module.scss";

const Alert: React.StatelessComponent<FormFieldProps> = (props: FormFieldProps) => {
  const { className, message, style, severity, size } = props;

  if (!message) return null;

  const classNames: { [className: string]: boolean } = {
    [styles.alert]: !!styles.alert,
    [styles.transparent]: props.transparent,
    [styles.error]: !severity || severity === "error",
    [styles.warning]: severity === "warning",
    [styles.info]: severity === "info",
    [className]: !!className,
    [styles.sm]: size === "sm"
  };

  return (
    <div style={style || {}} className={getClassName(classNames)}>
      {!props.hideIcon && (
        <div className={styles.icon}>
          <i className={`fa fa-${severity === "info" ? "info-circle" : "exclamation-triangle"}`} />
        </div>
      )}
      <div className={styles.content}>{message}</div>
    </div>
  );
};

export default Alert;
