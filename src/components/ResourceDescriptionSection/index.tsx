//external dependencies
import * as React from "react";
import getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from '../../reducers/labels'
import { Term, Leaflet } from "../";
import { WidgetConfig } from "../../reducers/statements";
import { getDereferenceableLink } from "../../facetConf";
import Tree from "../../helpers/Tree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as fa from "@fortawesome/free-solid-svg-icons";
import * as styles from "./style.module.scss";
declare namespace ResourceDescriptionSection {
  export interface StatementContext {
    path: N3.Quad[];
    value: string;
  }
  export interface GroupedStatements {
    [fingerPrint: string]: StatementContext[];
  }

  export interface Props {
    tree: Tree;
    level?: number;
    widget: WidgetConfig;
    selectedClass: string;
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
  toggleShow = () => {
    const { widget } = this.props;
    const enableToggle = widget.config && !!widget.config.asToggle;
    if (!enableToggle) return;
    this.setState((prevState: ResourceDescriptionSection.State, _props: ResourceDescriptionSection.Props) => {
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
          onClick={this.toggleShow}
        >
          {widget.config && widget.config.asToggle && (
            <FontAwesomeIcon className={styles.chevron} icon={this.state.show ? fa.faChevronUp : fa.faChevronDown} />
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
        <div
          className={getClassNames({
            [styles.children]: !!styles.children,
            [styles.dynamic]: widget.config.size === "dynamic",
            [styles.horizontalScroll]: widget.config.size === "scroll-horizontal"
          })}
        >
          {this.state.show &&
            widget.children.map(child => (
              <ResourceDescriptionSection
                key={child.key}
                selectedClass={this.props.selectedClass}
                widget={child}
                tree={tree}
                level={level + 1}
              />
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
      [styles.values]: !!styles.values
    };
    const dereferenceableLink = getDereferenceableLink(values[0].getPredicate().value)
    return (
      <div className={getClassNames(enabledStyles)}>
        {label && (
          <div className={styles.title}>
            {dereferenceableLink ? (
              <a href={dereferenceableLink} target="_blank" rel="noopener noreferrer" title={values[0].getPredicate().value}>
                {label}
              </a>
            ) : (
              <span title={values[0].getPredicate().value}>{label}</span>
            )}
          </div>
        )}
        <div className={styles.values}>
          {config.type === "leaflet" ? (
            //leaflet is special: we don't want to render each value independently, but we want to render all values in a single widget
            <Leaflet values={values.map(v => v.getTerm().value)} />
          ) : (
            values.map(value => (
              <Term
                key={value.getKey()}
                className={styles.obj}
                selectedClass={this.props.selectedClass}
                value={value}
                config={config}
                tree={tree}
              />
            ))
          )}
        </div>
      </div>
    );
  }
  render() {
    return this.renderValues() || this.renderChildren();
  }
}

export default ResourceDescriptionSection;
