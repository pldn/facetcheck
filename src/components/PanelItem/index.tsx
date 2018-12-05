import * as React from "react";
import * as getClassName from "classnames";

export interface IDatasetListItemProps {
  icon: string;
  name: string;
  longName?: string;
  className?: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<any>;
}
import * as styles from "./style.module.scss"

export default class DatasetListItem extends React.PureComponent<IDatasetListItemProps, any> {
  render() {
    const { icon, name, longName, className, active, onClick } = this.props;
    const enabledStyles = {
      [styles.item]: true,
      resetButton: true,
      [styles.active]: active
    };
    return (
      <button className={getClassName(enabledStyles, className)} onClick={onClick}>
        <i className={"fa " + icon} aria-hidden="true" />
        <span>
          {name}
        </span>

        <div className={styles.tooltip}>
          {name || longName}
        </div>
      </button>
    );
  }
}
