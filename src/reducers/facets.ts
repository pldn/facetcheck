//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions, GlobalState } from "reducers";

import * as ReduxObservable from "redux-observable";
import * as Redux from "redux";
import * as RX from "rxjs";

import { default as prefixes, getAsString, prefix } from "prefixes";
import SparqlBuilder from "helpers/SparqlBuilder";
import * as sparqljs from "sparqljs";
import SparqlJson from "helpers/SparqlJson";
// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_MATCHING_IRIS = "facetcheck/facets/GET_MATCHING_IRIS" as any,
  GET_MATCHING_IRIS_SUCCESS = "facetcheck/facets/GET_MATCHING_IRIS_SUCCESS" as any,
  GET_MATCHING_IRIS_FAIL = "facetcheck/facets/GET_MATCHING_IRIS_FAIL" as any,
  TOGGLE_CLASS = "facetcheck/facets/TOGGLE_CLASS" as any,
  FETCH_FACET_PROPS = "facetcheck/facets/FETCH_FACET_PROPS" as any,
  FETCH_FACET_PROPS_SUCCESS = "facetcheck/facets/FETCH_FACET_PROPS_SUCCESS" as any,
  FETCH_FACET_PROPS_FAIL = "facetcheck/facets/FETCH_FACET_PROPS_FAIL" as any
  // GET_FACET_CONFIG = "facetcheck/facets/GET_FACET_CONFIG" as any,
  // GET_FACET_CONFIG_SUCCESS = "facetcheck/facets/GET_FACET_CONFIG_SUCCESS" as any,
  // GET_FACET_CONFIG_FAIL = "facetcheck/facets/GET_FACET_CONFIG_FAIL" as any
}

export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;

export interface ClassProps {
  default: boolean;
  iri: string;
  label: string;
  facets: string[];
}
export var CLASSES: { [className: string]: ClassProps } = {
  "https://cultureelerfgoed.nl/vocab/Monument": {
    default: true, //default
    iri: "https://cultureelerfgoed.nl/vocab/Monument",
    label: "Monument",
    facets: ["https://cultureelerfgoed.nl/vocab/province"]
  },
  "https://data.pdok.nl/cbs/vocab/Gemeente": {
    default: false, //default
    iri: "https://data.pdok.nl/cbs/vocab/Gemeente",
    label: "Gemeente",
    facets: ["https://cultureelerfgoed.nl/vocab/province"]
  }
};
export type FacetTypes = "multiselect" | "slider" | "multiselectText";
export interface FacetProps {
  iri: string;
  label: string;
  datatype: string;
  facetType: FacetTypes;
  getBgp: (values: string[]) => string;
}
export var FACETS: { [property: string]: FacetProps } = {
  "https://cultureelerfgoed.nl/vocab/province": {
    iri: "https://cultureelerfgoed.nl/vocab/province",
    label: "Provincie",
    datatype: <string>null,
    facetType: "multiselect",
    getBgp: (values: string[]) => {
      return "";
    }
  }
};

export interface FacetValuesProps {
  iri: string;
  minValue: any;
  maxValue: any;
  values: any;
}
export var FacetValues = Immutable.Record<FacetValuesProps>(
  {
    iri: null,
    minValue: null,
    maxValue: null,
    values: null
  },
  "facetValues"
);
export type FacetValues = Immutable.Record.Inst<Partial<FacetValuesProps>>;
export type FacetsValues = Immutable.OrderedMap<string, FacetValues>;
export type SelectedClasses = Immutable.OrderedMap<string, boolean>;
export type FacetsProps = Immutable.OrderedMap<string, Immutable.Record.Inst<FacetValuesProps>>;
export var StateRecord = Immutable.Record(
  {
    matchingIris: Immutable.List<string>(),
    fetchResources: 0,
    selectedClasses: <SelectedClasses>Immutable.OrderedMap<string, boolean>().withMutations(m => {
      //populate selectedClasses (taken from object here, so no guarantees on sorting)
      for (const c of Object.keys(CLASSES)) {
        m.set(c, CLASSES[c].default);
      }
      return m;
    }),
    facetsValues: <FacetsProps>Immutable.OrderedMap<string, Immutable.Record.Inst<FacetValuesProps>>()
  },
  "facets"
);
export var initialState = new StateRecord();

export type StateRecordInterface = typeof initialState;

export interface Action extends GlobalActions<Actions> {
  checked?: boolean;
  className?: string;
}

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case Actions.GET_MATCHING_IRIS:
      return state.update("fetchResources", num => num + 1);
    case Actions.GET_MATCHING_IRIS_FAIL:
      return state.update("fetchResources", num => num - 1);
    case Actions.GET_MATCHING_IRIS_SUCCESS:
      return state.update("fetchResources", num => num - 1).set("matchingIris", Immutable.List(action.result));
    case Actions.TOGGLE_CLASS:
      return state.setIn(<[keyof StateRecordInterface, string]>["selectedClasses", action.className], action.checked);
    default:
      return state;
  }
}

export type Action$ = ReduxObservable.ActionsObservable<any>;
// export type Action$ = ReduxObservable.ActionsObservable<any>;
export type Store = Redux.Store<GlobalState>;
export var epics: [(action: Action$, store: Store) => any] = [
  /**
   * Do some bookkeeping on which descriptions to remove, and which ones to fetch
   */
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.TOGGLE_CLASS).map((_any: any) => {
      return getMatchingIris(store.getState());
    });
  }
];
export function facetsToQuery(state: GlobalState) {
  const sparqlBuilder = SparqlBuilder.get(prefixes);
  sparqlBuilder
    .vars("?_r")
    .limit(2)
    .distinct();

  /**
   * Add classes
   */
  sparqlBuilder.hasClasses(
    ...state.facets.selectedClasses
      .filter(val => val)
      .keySeq()
      .toArray()
  );

  return sparqlBuilder.toString();

  // var facetPatterns:string[] = [];
  // for (var pred in state.facetFilters) {
  //   var filter = state.facetFilters[pred];
  //   if (filter.values) {
  //     var useFilterComparison = false;
  //     if (filter.datatype === 'http://www.w3.org/2001/XMLSchema#float') {
  //       //can't match on lexical form, but have to do comparison in filter
  //       // is expensive, but now other way
  //       useFilterComparison = true;
  //     }
  //     //consider multiple checked values for a pred 'or's'
  //     //I.e., for these, we want unions
  //     facetPatterns.push('{ ' + filter.values.map((val) => {
  //       if (useFilterComparison) {
  //         return `
  //         ?iri <${pred}> ?val .
  //         FILTER(?val = "${val.value}"^^<${filter.datatype}>)
  //         `
  //       } else {
  //         if (filter.isLiteral) {
  //           return `
  //           ?iri <${pred}> "${val.value}"^^<${filter.datatype}> .
  //           `
  //         } else {
  //           return `
  //           ?iri <${pred}> <${val.value}> .
  //           `
  //         }
  //       }
  //     }).join('} UNION {') + ' } ');
  //   }
  //   if (filter.greaterThan) {
  //     facetPatterns.push(`
  //       {?iri <${pred}> ?date . FILTER(?date >= "${filter.greaterThan}"^^<${filter.datatype}> )}`)
  //   }
  //   if (filter.lessThan) {
  //     facetPatterns.push(`
  //       {?iri <${pred}> ?date . FILTER(?date <= "${filter.lessThan}"^^<${filter.datatype}> )}`)
  //   }
  // }
  // var facetClauses = '';
  // if (facetPatterns.length) facetClauses = facetPatterns.join('');//don't do union here. conjunctive
  // var classClauses = getSelectedClasses(state).map(activeClass => {
  //   // return `?iri rdf:type <${activeClass}> . { ${facetClauses} }`
  //
  //
  //   //NOTE: first facet clauses , then subclass stuff. Is waaaay faster than the other way around
  //   return `
  //     { ${facetClauses} }
  //     ?iri rdf:type <${activeClass}> .
  //     `
  //     // BIND(<${activeClass}> as ?forClass)
  //     // ?anySubClass rdfs:subClassOf* ?forClass .
  //     // ?iri rdf:type ?anySubClass .

  //
  // });
  // if (classClauses.length === 0) {
  //   throw new Error('empty query')
  // }
  // var classClausString = classClauses.join(`} UNION {`)
  // return `
  //   ${PREFIXES}
  //   SELECT ?iri WHERE {
  //     { ${classClausString} }
  //   } LIMIT 20
  // `
  // return `${getAsString()}
  // SELECT ?_r WHERE {
  //   BIND(<https://cultureelerfgoed.nl/id/monument/511321> as ?_r)
  // } LIMIT 20

  // `
}

export function toggleClass(className: string, checked: boolean): Action {
  return {
    type: Actions.TOGGLE_CLASS,
    className: className,
    checked: checked
  };
}

export function getMatchingIris(state: GlobalState): any {
  console.log("get matching iris");
  return {
    types: [Actions.GET_MATCHING_IRIS, Actions.GET_MATCHING_IRIS_SUCCESS, Actions.GET_MATCHING_IRIS_FAIL],
    promise: (client: ApiClient) =>
      client
        .req<any, SparqlJson>({
          sparqlSelect: facetsToQuery(state)
        })
        .then(sparql => {
          return sparql.getValuesForVar("_r");
        })
  };
}

export function getFacetProps(forProp: string) {
  // const sparqlBuilder = SparqlBuilder.get(prefixes);
  // sparqlBuilder.distinct();
  // const facetConf = FACETS[forProp]
  // if (!facetConf) {
  //   throw new Error('Could not find facet config for ' + forProp)
  // }
  // if (facetConf.facetType === 'multiselect') {
  //   sparqlBuilder.vars('?_r').limit(100);
  //
  //
  // } else {
  //   throw new Error('Unknown facet type ' + facetConf.facetType)
  // }
  // return {
  //   types: [Actions.FETCH_FACET_PROPS, Actions.FETCH_FACET_PROPS_SUCCESS, Actions.FETCH_FACET_PROPS_FAIL],
  //   promise: (client:ApiClient) => client.req<any, SparqlJson>({
  //     sparqlSelect: facetsToQuery(state),
  //   }).then((sparql) => {
  //     return sparql.getValuesForVar('_r');
  //   })
  // };
}

// export function getFacets(state:GlobalState):FacetValues[] {
//
//   var props:string[] = [];
//   for (const [className,selected] of state.facets.selectedClasses) {
//     if (selected) {
//       props = props.concat(CLASSES[className].facets)
//     }
//   }
//   props = _.uniq(props);
//
//
//   return props.map(p => {
//     if (state.facets.facetsValues.has(p)) {
//       return state.facets.facetsValues(p)
//     }
//
//   })
//
//
//   const facets:FacetValues[] = [];
//   return facets;
// }
