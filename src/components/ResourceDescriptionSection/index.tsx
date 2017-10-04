//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from "immutable";
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { Term } from "components";
import { getLabel, getWidgets, WidgetConfig } from "reducers/statements";
import Tree from "helpers/Tree";

const styles = require("./style.scss");
namespace ResourceDescriptionSection {
  export interface StatementContext {
    path: N3.Statement[];
    value: string;
  }
  export interface GroupedStatements {
    [fingerPrint: string]: StatementContext[];
  }

  export interface Props {
    tree: Tree;
    level?: number;
    widget: WidgetConfig;
    // show?:boolean
    // label?:string
  }
  export interface State {
    show: boolean;
  }
}

const indent = 10; //indent for subsections
class ResourceDescriptionSection extends React.PureComponent<
  ResourceDescriptionSection.Props,
  ResourceDescriptionSection.State
> {
  constructor(props: ResourceDescriptionSection.Props) {
    super(props);
    this.state = {
      show:
        !props.widget ||
        !props.widget.children ||
        !props.widget.config ||
        !props.widget.config.asToggle ||
        !props.widget.config.hideOnLoad
    };
  }
  static defaultProps: Partial<ResourceDescriptionSection.Props> = {
    level: 0
  };
  toggleShow() {
    const {widget} = this.props;
    const enableToggle = widget.config && !!widget.config.asToggle;
    if (!enableToggle) return
    this.setState((prevState: ResourceDescriptionSection.State, props: ResourceDescriptionSection.Props) => {
      return { show: !prevState.show };
    });
  }

  renderChildren(): JSX.Element {
    if (!this.props.widget || !this.props.widget.children) return null;
    const { widget, tree, level } = this.props;
    const enableToggle = widget.config && !!widget.config.asToggle;
    return (
      <div className={styles.section} style={{ marginLeft: level * indent }}>
        <div
          className={getClassNames(styles.sectionHeader, styles.full, {
            [styles.asToggle]: enableToggle
          })}
          onClick={this.toggleShow.bind(this)}
        >
          {widget.config &&
            widget.config.asToggle && (
              <i
                className={getClassNames({
                  fa: true,
                  "fa-chevron-down": !this.state.show,
                  "fa-chevron-up": this.state.show,

                  [styles.chevron]: !!styles.chevron
                })}
              />
            )}
          {widget.label && (
            <span
              className={styles.label}
              style={{
                fontSize: "" + (200 - 20 * level) + "%"
              }}
            >
              {widget.label}
            </span>
          )}
        </div>
        <div className={getClassNames({
          [styles.children]: !!styles.children,
          [styles.dynamic]: widget.config.size === 'dynamic'
        })}>
          {this.state.show &&
            widget.children.map(child => (
              <ResourceDescriptionSection key={child.key} widget={child} tree={tree} level={level + 1} />
            ))}
        </div>
      </div>
    );
  }
  renderValues() {
    if (!this.props.widget || !this.props.widget.values || !this.props.widget.values.length) return null;
    const { widget, tree } = this.props;
    const { values, config, label } = widget;

    const enabledStyles: { [key: string]: boolean } = {
      [styles.values]: !!styles.values,
    };
    return (
      <div className={getClassNames(enabledStyles)}>
        {label && (
          <div className={styles.title}>
            <span>{label}</span>
          </div>
        )}
        <div className={styles.values}>
          {values.map(value => (
            <Term key={value.getKey()} className={styles.obj} term={value.getTerm()} config={config} tree={tree} />
          ))}
        </div>
      </div>
    );
  }
  render() {
    return this.renderValues() || this.renderChildren();
  }
}

export default ResourceDescriptionSection;
