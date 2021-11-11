import * as React from "react";
import getClassName from "classnames";

//import own dependencies

export interface LabelProps {
 className?: string;
 style?: React.CSSProperties;
 message?: string | React.ReactElement<any>;
 severity?: "error" | "warning" | "info" | "success"; //defaults to info
}
import * as styles from "./style.module.scss";

const Label: React.StatelessComponent<LabelProps> = (props: LabelProps) => {
 const { className, message, style, severity} = props;

 if (!message) return null;

 const classNames: { [className: string]: boolean } = {
   [styles.label]: !!styles.label,
   [styles.error]: severity === "error",
   [styles.warning]: severity === "warning",
   [styles.info]: !severity || severity === "info",
   [styles.success]: severity === "success",
   [className]: !!className
 };

 return (
   <div style={style || {}} className={getClassName(classNames)}>
     <span>{message}</span>
   </div>
 );
};

export default Label;
