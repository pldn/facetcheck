import * as React from "react";

import { spring, TransitionMotion, presets } from "react-motion";
import { StateInterface as NotificationState, removeNotification } from "reducers/notifications";
import { Notification } from "components";

export namespace Notifications {
  export interface Props {
    notifications: NotificationState;
    closeHandler: typeof removeNotification;
  }
}

import * as styles from "./style.scss";
export default class Notifications extends React.PureComponent<Notifications.Props, any> {
  /**
  The only way to both animate the notifications, -and- allow for dynamic notification heights
  is by using max-height. However, animating this comes at a cost: it needs to re-draw large parts
  of the screen during the animation.
  See https://github.com/chenglou/react-motion/issues/62#issuecomment-227426450

  If this becomes a problem (e.g. a stuttering animation) we'd better just fix the height
  depending on a guestimate of the notification length
  **/
  willLeave(): any {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {
      maxHeight: spring(0),
      paddingTop: spring(0),
      paddingBottom: spring(0),
      opacity: spring(0),
      marginTop: spring(0),
      fontSize: spring(0)
    };
  }
  willEnter() {
    return {
      maxHeight: 0,
      opacity: 1
    };
  }
  render() {
    const { notifications, closeHandler } = this.props;

    return (
      <div className={styles.notifications}>
        <TransitionMotion
          willLeave={this.willLeave}
          willEnter={this.willEnter}
          styles={notifications.toArray().map(notification => ({
            key: notification.notificationKey,
            style: {
              maxHeight: spring(10000, presets.noWobble),
              opacity: 1,
              marginTop: 12,
              fontSize: 15,
              paddingTop: 10,
              paddingBottom: 10
            },
            data: notification.toJS()
          }))}
        >
          {(interpolatedStyles: any) =>
            <div>
              {interpolatedStyles.map((config: any) => {
                return (
                  <Notification closeHandler={closeHandler} key={config.key} {...config.data} style={config.style} />
                );
              })}
            </div>}
        </TransitionMotion>
      </div>
    );
  }
}
