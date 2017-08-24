//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
//import own dependencies
import { IComponentProps } from "containers";
import { toggleDsPanelCollapseLg } from "reducers/app";
// import {getSubclassRelations} from 'reducers/schema'
import { asyncConnect, IAsyncConnect } from "redux-connect";
// import ResourceTreeItem from 'helpers/ResourceTreeItem'
import { GlobalState } from "reducers";
// import {State as SchemaState} from 'reducers/schema'
// import {getLabel, State as LabelsState} from 'reducers/labels'
// import { State as FacetState,ActiveClasses,setActiveClasses,getSelectedClasses,setFacetFilter} from 'reducers/facets'
// import { Shapes,getShapesForClasses} from 'reducers/schema'
import {
  // DataAdd
  PanelItem,
  FacetMultiSelect,
  Facet
} from "components";
import {} from "containers";

namespace Panel {
  export interface Props extends IComponentProps {
    collapsed?: boolean;
    className?: string;
    currentClass?: string;
    toggleDsPanelCollapseLg?: typeof toggleDsPanelCollapseLg;
    subClassRelations?: Object;
    // labels?:LabelsState
    // facets?:FacetState,
    // setActiveClasses?: typeof setActiveClasses,
    // shapes?:Shapes,
    // setFacetFilter? : typeof setFacetFilter,
    refreshingShapes?: boolean;
  }
  export interface State {
    // subclassTree: ResourceTreeItem
  }
}

const styles = require("./style.scss");
const mapStateToProps = (state: GlobalState, ownProps: Panel.Props) => {
  return {
    // activeClasses: state.facets.activeClasses,
    // subClassRelations: state.schema.subclassRelations,
    // labels: state.labels,
    // facets: state.facets,
    // shapes: state.schema.shapes,
    // refreshingShapes: state.schema.gettingShapes
  };
};
const mapDispatchToProps: MapDispatchToPropsObject = {
  toggleDsPanelCollapseLg
  // setActiveClasses,
  // setFacetFilter,
};

@(connect as any)(mapStateToProps, mapDispatchToProps)
class Panel extends React.PureComponent<Panel.Props, Panel.State> {
  //cant use base component that does shallow compare, as the panels won't update with a new active state.
  //might be because react-router-bootstrap clones its children?
  state: Panel.State = {
    subclassTree: null
  };

  componentWillMount() {
    //assuming schema is static
    // if (!this.state.subclassTree && _.size(this.props.subClassRelations as any)) this.setState({subclassTree: ResourceTreeItem.fromJson(this.props.subClassRelations)})
  }

  // getClassOptions():FacetMultiSelect.Option[]  {
  // if (!this.state.subclassTree) return [];
  // const getOptions = (item:ResourceTreeItem):FacetMultiSelect.Option[] => {
  //   //get first root node with more than 1 child
  //   if (item.children.length === 0) return [];
  //   if (item.children.length === 1) return getOptions(item.children[0])
  //   return item.children.map(child => ({
  //     label: getLabel(this.props.labels, child.iri),
  //     value: child.iri,
  //     link: child.iri
  //   }))
  //   }
  //   return getOptions(this.state.subclassTree)
  // }
  render() {
    const {
      refreshingShapes,
      // shapes,
      className,
      toggleDsPanelCollapseLg,
      collapsed,
      currentClass,
      subClassRelations
      // labels,facets
    } = this.props;
    //assuming schema is static

    const classNames: { [className: string]: boolean } = {
      [styles.panel]: true
      // [styles.collapsed]: collapsed
    };

    // const currentPath = "/" + currentAccount.accountName + '/' + currentDs.name + '/';
    return (
      <div className={getClassName(className, classNames)}>
        {/*header
        <div className={getClassName(styles.header, styles.section)}>
          <div className={styles.headerTitle}>
            <LinkContainer onlyActiveOnIndex to={''}><PanelItem icon="fa-home" name={currentClass}/></LinkContainer>
          </div>
          <LinkContainer  to={'settings'}>
            <Button bsStyle="link" className={getClassName(styles.config, 'resetButton', styles.hideCollapsed)}>
                <i className="fa fa-gear"></i>
            </Button>
          </LinkContainer>

          <LinkContainer  to={'settings'}>
            <PanelItem icon="fa-gear" name="Config" className={styles.onlyShowCollapsed}/>
          </LinkContainer>

        </div>
        */}

        {/*main*/}
        <div className={styles.main}>
          PANEL
          {
            //   this.state.subclassTree &&
            // <div className={getClassName(styles.section, styles.staticFacets)}>
            //   <div className={styles.sectionHeader}>
            //     Classes
            //   </div>
            //   <FacetMultiSelect
            //   onChange={this.props.setActiveClasses}
            //   activeValues={facets.activeClasses}
            //   options={this.getClassOptions()}
            //   forShape={null}
            //   />
            // </div>
          }
          {
            //   getShapesForClasses(getSelectedClasses(facets),shapes).map((shape) => {
            //   return <Facet
            //     key={shape.predicate}
            //     disabled={refreshingShapes}
            //     setFacetFilter={this.props.setFacetFilter}
            //     filter={facets.facetFilters[shape.predicate] }
            //     label={getLabel(labels, shape.predicate)}
            //     shape={shape}
            //     labels={labels}
            //     />
            // })
          }
        </div>
        {/**
        <Button className={getClassName('resetButton', styles.toggler, styles.footer)} onClick={toggleDsPanelCollapse}>
          <i className={getClassName({fa:true, 'fa-chevron-left': !collapsed, 'fa-chevron-right': collapsed})}></i>
        </Button>
        **/}
      </div>
    );
  }
}
export default Panel;
