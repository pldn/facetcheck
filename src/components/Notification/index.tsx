import * as React from "react";

import * as getClassName from "classnames";
// import {Row,Col} from 'react-bootstrap';
// import {LinkContainer} from 'react-router-bootstrap'
import { NotificationRecordProps, NotificationType, removeNotification } from "../../reducers/notifications";
// import {Models} from '../../../typings-tmp/swagger'

export interface INotificationsProps extends NotificationRecordProps {
  className?: string;
  closeHandler: typeof removeNotification;
  style: React.CSSProperties;
}
import * as styles from "./style.scss";

/**
 * Setting styles directly instead of using classes
   Need this because we're manipulating the style from the Notifications component
   using React Motion
 */
export default class Notifications extends React.PureComponent<INotificationsProps, any> {
  componentDidMount() {
    if (this.props.timeout && this.props.timeout > 0) {
      setTimeout(() => {
        this.props.closeHandler(this.props.notificationKey);
      }, this.props.timeout);
    }
  }
  // const FormFieldAlert:React.StatelessComponent<IDatasetListItemProps> = (props:IDatasetListItemProps) => {
  render() {
    const { message, devMessage, type, title, closeHandler, notificationKey, style } = this.props;

    const classNames = {
      [styles.notification]: true,
      [styles.info]: type === NotificationType.INFO,
      [styles.warning]: type === NotificationType.WARNING,
      [styles.error]: type === NotificationType.ERROR,
      [styles.success]: type === NotificationType.SUCCESS
    };
    return (
      <div className={getClassName(classNames, this.props.className)} style={style}>
        <div className={styles.notificationBody}>
          <div className={styles.notificationIcon} style={{ fontSize: +style.fontSize * 1.8 }} />
          <div className={styles.message}>
            {title &&
              <div className={styles.notificationHeader} style={{ fontSize: +style.fontSize * 1.2 }}>
                {title}
              </div>}
            <div>
              {message}
            </div>
            {devMessage &&
              <div className={styles.devMessage}>
                <div>You're special, you get a more detailed message:</div> {devMessage}
              </div>}
          </div>
          <button
            onClick={() => closeHandler(notificationKey)}
            type="button"
            className={styles.closeBtn}
            style={{ fontSize: +style.fontSize * 1.5 }}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    );
  }
}
