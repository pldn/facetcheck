//external dependencies
import * as React from "react";
// import * as Helmet from 'react-helmet';
import * as _ from "lodash";
import { connect, MapDispatchToPropsObject } from "react-redux";
import * as getClassName from "classnames";
//import own dependencies
import { asyncConnect, IAsyncConnect } from "redux-connect";
import Checkbox from 'react-toolbox/lib/checkbox';
import { GlobalState } from "reducers";
import {toggleClass,SelectedClasses,FacetsProps,setSelectedFacetValue,setSelectedObject} from 'reducers/facets'
import {CLASSES,FACETS} from 'facetConf'
import {
  Facet,
} from "components";
import {} from "containers";

namespace Panel {
  // export interface OwnProps extends IComponentProps {
  // }
  export interface DispatchProps {
    toggleClass: typeof toggleClass
    setSelectedFacetValue: typeof setSelectedFacetValue
    setSelectedObject: typeof setSelectedObject
  }
  export interface PropsFromState {
    selectedClasses: SelectedClasses,
    facetsProps: FacetsProps
  }

  export interface State {
  }
  export type Props =  DispatchProps & PropsFromState;
}

const styles = require("./style.scss");

class Panel extends React.PureComponent<Panel.Props, Panel.State> {

  renderFacets() {
    return
    //
    // const {facetsValues} = this.props;
    // return facetsValues.valueSeq().map((facet) => {
    //   const iri = facet.iri;
    //   const staticFacetConfig = FACETS[iri];
    //   if (!staticFacetConfig) throw new Error('Missing facet config for ' + iri);
    //   if (staticFacetConfig.facetType === 'multiselect') {
    //     return <div key={iri} className={styles.section}>
    //       <div className={styles.sectionHeader}>{staticFacetConfig.label}</div>
    //
    //       <FacetMultiSelect
    //
    //       options={}
    //       onChange={(valueKey, checked) => {
    //         this.props.setFacetMultiselectValue(iri, valueKey, checked)
    //       }}
    //       />
    //       </div>
    //   } else if(staticFacetConfig.facetType === 'slider') {
    //
    //     return <div key={iri} className={styles.section}>
    //       <div className={styles.sectionHeader}>{staticFacetConfig.label}</div>
    //         <FacetSlider
    //           options={{
    //             min: +facet.options.min,
    //             max:+facet.options.max
    //           }}
    //           onChange={(min,max) => {this.props.setFacetsetFacetMinMaxValue(iri, ""+min,""+max)}}/>
    //       </div>
    //   } else if (staticFacetConfig.facetType === 'nlProvinces') {
    //     return <div key={iri} className={styles.section}>
    //       <div className={styles.sectionHeader}>{staticFacetConfig.label}</div>
    //       <FacetProvinces
    //
    //       options={facet.options.map((val) => {
    //         return {
    //           value: val.value,
    //           label: val.label,
    //           checked: facet.selectedValues.has(val.value)
    //         }
    //       })}
    //       onChange={(valueKey, checked) => {
    //         this.props.setFacetMultiselectValue(iri, valueKey, checked)
    //       }}
    //       />
    //       </div>
    //   }
    //   throw new Error('Unsupported facettype ' + staticFacetConfig.facetType)
    //
    // })
    // return null;
  }


  renderClasses() {
    return <div className={styles.section}>
      <div className={styles.sectionHeader}>Classes</div>
      {
      this.props.selectedClasses.map((val,key) => {
        const CLASS = CLASSES[key]
          return <Checkbox
            label={CLASS.label}
            checked={val}
            key={key}
            onChange={(checked:boolean) => {
              this.props.toggleClass(key, checked)
            }}
            />
      }).valueSeq().toArray()
      }



    </div>
  }
  render() {
    const {
      setSelectedObject,
      setSelectedFacetValue
    } = this.props;

    const classNames: { [className: string]: boolean } = {
      [styles.panel]: true,
      [styles.main]: true
    };

    return (
      <div className={getClassName(classNames)}>
        {this.renderClasses()}

        {
          this.props.facetsProps.valueSeq().map((facet) => {
            return <Facet facetProps={facet} setSelectedFacetValue={setSelectedFacetValue} setSelectedObject={setSelectedObject}/>
          })
        }

      </div>
    );
  }
}
// export default Panel;




export default connect<GlobalState, Panel.PropsFromState, Panel.DispatchProps, {}>(
  (state, ownProps) => {
    return {
      selectedClasses: state.facets.classes,
      facetsProps: state.facets.facets
    };
  },
  //dispatch
  {
    toggleClass:toggleClass,
    setFacetMultiselectValue: setSelectedObject,
    setFacetsetFacetMinMaxValue:setSelectedObject
  }
)(Panel);
