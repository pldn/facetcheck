import * as React from "react";
import * as _ from "lodash";

import { Facet, Button } from "../";
import { Facet as GenericFacetProps } from "../../reducers/facets";
import { FACETS } from "../../facetConf";
import { FacetOptionsSearch } from "../../facetConfUtils";
import * as numeral from "numeral";
import { default as SparqlJson } from "../../helpers/SparqlJson";
import SparqlBuilder from "../../helpers/SparqlBuilder";
import { TextField } from "material-ui";


import * as styles from "./style.module.scss"

require("numeral/locales/nl-nl");
numeral.locale("nl-nl");

declare namespace FacetSearch {

  export interface FacetProps extends GenericFacetProps {
    optionObject: FacetOptionsSearch;
  }
  export interface Props extends Facet.Props {
    facet: FacetProps;
  }
  export interface State {
    previousValue: string;
    inputValue: string;
  }
}


@Facet.staticImplements<Facet.FacetComponent>()
class FacetSearch extends React.PureComponent<FacetSearch.Props, FacetSearch.State> {
  inputRef: any;
  constructor(props:FacetSearch.Props){
    super(props);
    this.state = {
      previousValue: '',
      inputValue: ''
    }
  }
  static shouldRender(props: Facet.Props) {
    return FACETS[props.facet.iri].facetType === "search";
  }
  static prepareOptionsQuery(_sparqlBuilder: SparqlBuilder): SparqlBuilder {
    throw new Error("This function should not be called or implemented, since it doesn't make sense to have a default value for a search field.")
  }

  static getOptionsForQueryResult(_sparql: SparqlJson): FacetOptionsSearch {
    throw new Error("This function should not be called or implemented, since it doesn't make sense to have a default value for a search field.")
  }

  performSearch(searchString:string){
    if (searchString===this.state.previousValue) return;
    const { facet, setSelectedSearchString } = this.props;
    this.setState({previousValue: (event.target as any).value});
    setSelectedSearchString(facet.iri, { searchString: searchString });
  }

  onAfterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.performSearch(event.target.value)
  }

  onKeyUp = (event:React.KeyboardEvent) => {
    if (event.keyCode === 13) {
      // ENTER key
      this.performSearch((event.target as any).value)
    } else if (event.keyCode === 27){
      // ESC key
      // this.setState({inputValue:this.state.previousValue}) // doesnt work properly
      this.inputRef.blur()
    }
  }
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     this.setState({
       inputValue: event.target.value,
     });
   };
  render() {
    const { facet } = this.props;
    if (!facet.optionObject) return null;
    return (
      <div className={styles.textFieldWrapper}>
        <TextField
          name={this.props.facet.get('iri')}
          onBlur={this.onAfterChange.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          className={styles.textField}
          value={this.state.inputValue}
          onChange={this.handleChange}
          ref={(el: any) => (this.inputRef = el)}
        />
        <span className={styles.button}>↵</span>
      </div>
    );
  }
}
export default FacetSearch;
