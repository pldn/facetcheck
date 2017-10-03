//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions, GlobalState } from "reducers";
import { FACETS, CLASSES, FacetValue,ClassConfig } from "facetConf";
import * as ReduxObservable from "redux-observable";
import * as Redux from "redux";
import * as RX from "rxjs";
import { Facet as FacetComponent } from "components";
import { default as prefixes, getAsString, prefix } from "prefixes";
import SparqlBuilder from "helpers/SparqlBuilder";
import * as sparqljs from "sparqljs";
import { default as SparqlJson, Term as SparqlTerm } from "helpers/SparqlJson";
// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_MATCHING_IRIS = "facetcheck/facets/GET_MATCHING_IRIS" as any,
  GET_MATCHING_IRIS_SUCCESS = "facetcheck/facets/GET_MATCHING_IRIS_SUCCESS" as any,
  GET_MATCHING_IRIS_FAIL = "facetcheck/facets/GET_MATCHING_IRIS_FAIL" as any,
  SET_SELECTED_CLASS = "facetcheck/facets/SET_SELECTED_CLASS" as any,
  FETCH_FACET_PROPS = "facetcheck/facets/FETCH_FACET_PROPS" as any,
  FETCH_FACET_PROPS_SUCCESS = "facetcheck/facets/FETCH_FACET_PROPS_SUCCESS" as any,
  FETCH_FACET_PROPS_FAIL = "facetcheck/facets/FETCH_FACET_PROPS_FAIL" as any,
  REFRESH_FACETS = "facetcheck/facets/REFRESH_FACETS" as any,
  SET_FACET_VALUE = "facetcheck/facets/SET_FACET_VALUE" as any
  // GET_FACET_CONFIG = "facetcheck/facets/GET_FACET_CONFIG" as any,
  // GET_FACET_CONFIG_SUCCESS = "facetcheck/facets/GET_FACET_CONFIG_SUCCESS" as any,
  // GET_FACET_CONFIG_FAIL = "facetcheck/facets/GET_FACET_CONFIG_FAIL" as any
}

export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;

// export type FacetValueOptions = Partial<FacetProvinces.Options & FacetMultiSelect.Options & FacetSlider.Options>;
export interface FacetProps {
  iri: string;
  selectedFacetValues: Immutable.Set<string>;

  //we're never modifying props in these objects, but always overwriting it completely
  //so no use using an immutable model here
  optionList: FacetValue[];
  optionObject: { [key: string]: FacetValue | number };
  selectedObject: { [key: string]: number };
}
export var Facet = Immutable.Record<FacetProps>(
  {
    iri: null,
    selectedFacetValues: Immutable.Set(),
    optionList: null,
    optionObject: null,
    selectedObject: null
  },
  "facetValues"
);
export type Facet = Immutable.Record.Inst<FacetProps>;
export type SelectedClasses = Immutable.OrderedMap<string, boolean>;

export var StateRecord = Immutable.Record(
  {
    matchingIris: Immutable.List<string>(),
    fetchResources: 0,
    updateFacetInfoQueue: Immutable.List<string>(),
    selectedClass: <string>_.values<ClassConfig>(CLASSES).find((val) => val.default).iri,
    facets: Immutable.OrderedMap<string, Facet>()
  },
  "facets"
);
export var initialState = new StateRecord();

export type StateRecordInterface = typeof initialState;
export type FacetsProps = StateRecordInterface["facets"];

export interface Action extends GlobalActions<Actions> {
  className?: string;
  facetName?: string;
  result?: {
    optionList?: FacetProps["optionList"];
    optionObject?: FacetProps["optionObject"];
    iris?:string[];
  };
  facetQueue?: string[];
  facetValueKey?: string;
  checked?: boolean;
  selectedFacetObject?: FacetProps["selectedObject"];
  sync?:boolean
}

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case Actions.GET_MATCHING_IRIS:
      return state.update("fetchResources", num => num + 1);
    case Actions.GET_MATCHING_IRIS_FAIL:
      return state.update("fetchResources", num => num - 1);
    case Actions.GET_MATCHING_IRIS_SUCCESS:
      return state
        .update("fetchResources", num => num - 1)
        .set("matchingIris", Immutable.List<string>(action.result.iris));
    case Actions.SET_SELECTED_CLASS:
      return state.set("selectedClass",action.className);
    case Actions.SET_FACET_VALUE:
      return state.update("facets", facet => {
        return facet.update(action.facetName, new Facet(), _vals => {
          return _vals.withMutations(vals => {
            if (action.facetValueKey) {
              //assuming multi-select
              if (action.checked) {
                vals.update("selectedFacetValues", selected => selected.add(action.facetValueKey));
              } else {
                vals.update("selectedFacetValues", selected => selected.remove(action.facetValueKey));
              }
            } else if (action.selectedFacetObject) {
              vals.set("selectedObject", action.selectedFacetObject);
            }
            return vals;
          });
        });
      });
    case Actions.REFRESH_FACETS:
      return state.set('facets', Immutable.OrderedMap())//clear old facet configs
        .set('matchingIris', Immutable.List())//clear old facet configs
        .set("updateFacetInfoQueue", Immutable.List(action.facetQueue));
    case Actions.FETCH_FACET_PROPS:
      return state.update("updateFacetInfoQueue", list => {
        const i = list.indexOf(action.facetName);
        if (i >= 0) return list.delete(list.indexOf(action.facetName))
        return list;
      });
    case Actions.FETCH_FACET_PROPS_SUCCESS:
      if (action.sync) {
        //if this is executed in sync (i.e. without sparql request)
        //we have to make sure the queue gets decremented as well (this is otherwise done before the ajax query is sent)
        const queueIndex = state.updateFacetInfoQueue.indexOf(action.facetName);
        if (queueIndex >= 0) {
          state = state.update("updateFacetInfoQueue", list => list.delete(queueIndex));
        }
      }
      const facetSorting = getFacetsForClass(getSelectedClass(state));
      return state.update("facets", facet => {
        return facet.update(action.facetName, new Facet(), _vals => {
          return _vals.withMutations(vals => {
            vals.set("iri", action.facetName);
            if (action.result.optionList) {
              vals.set("optionList", action.result.optionList);
            }
            if (action.result.optionObject) {
              vals.set("optionObject", action.result.optionObject);
            }
          });
        }).sortBy((val,key) => {
          return facetSorting.indexOf(key)
        });
      });
    default:
      return state;
  }
}

export type Action$ = ReduxObservable.ActionsObservable<any>;
// export type Action$ = ReduxObservable.ActionsObservable<any>;
export type Store = Redux.Store<GlobalState>;
export var epics: [(action: Action$, store: Store) => any] = [
  //update matching iris when classes change
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.SET_SELECTED_CLASS).map((action: Action) => {
      //facet settings might need removing before fetching the matching iris. So make sure we don't call one before the other
      // store.dispatch(getMatchingIris(store.getState()));
      return store.dispatch(refreshFacets(store.getState(), action.className));
    });
  },
  //update matching iris when facets change
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.SET_FACET_VALUE).map((action: Action) => {
      return store.dispatch(getMatchingIris(store.getState()));
    });
  },
  //update matching iris when facets are refreshed (this triggers new resourcedescriptions as well)
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.REFRESH_FACETS).map((action: Action) => {
      return store.dispatch(getMatchingIris(store.getState()));
    });
  },

  //update facet information when facets are added to the queue
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.REFRESH_FACETS).map((action: Action) => {
      return store.dispatch(getFacetProps(store.getState(), action.facetQueue[0]));
    });
  },
  //update facet information when another one finished
  (action$: Action$, store: Store) => {
    return action$
      .ofType(Actions.FETCH_FACET_PROPS_SUCCESS)
      .filter(() => {
        return !!store.getState().facets.updateFacetInfoQueue.size;
      })
      .map((action: Action) => {
        const state = store.getState();
        return store.dispatch(getFacetProps(state, state.facets.updateFacetInfoQueue.first()));
      });
  }
];
export function getFacetsForClass(selectedClass:string):string[] {
  if (!CLASSES[selectedClass]) throw new Error('No class definition found for ' + selectedClass)
  return CLASSES[selectedClass].facets;
}
export function facetsToQuery(state: GlobalState) {
  const sparqlBuilder = SparqlBuilder.get(prefixes);
  sparqlBuilder
    .vars("?_r")
    .limit(2)
    .distinct();

  /**
   * Add classes
   */
  const selectedClass = getSelectedClass(state.facets);
  sparqlBuilder.hasClasses(selectedClass);

  /**
   * Get facets we might need to integrate in this query
   */
  var facetsToCheck: string[] = getFacetsForClass(selectedClass).filter(f => {
    const facetsValues = state.facets.facets.get(f);
    if (!facetsValues) return false;
    return !!_.size(facetsValues.selectedObject) || !!facetsValues.selectedFacetValues.size;
  });

  var queryPatterns: sparqljs.QueryPattern[] = [];
  for (const facetIri of facetsToCheck) {
    const facetConfig = FACETS[facetIri];
    const facetsValues = state.facets.facets.get(facetIri);
    var bgp = "";
    if (facetsValues.selectedFacetValues.size) {
      const listOfFacetValues = facetsValues.optionList
        ? facetsValues.optionList
        : _.values<FacetValue>(facetsValues.optionObject);
      const pattern = facetConfig.facetToQueryPatterns(
        listOfFacetValues.filter(v => facetsValues.selectedFacetValues.has(v.value))
      );
      if (pattern && pattern.length) bgp += `{ ${pattern} }`;
    } else {
      //just pass the object
      const pattern = facetConfig.facetToQueryPatterns(facetsValues.selectedObject);
      if (pattern && pattern.length) {
        bgp += "{" + pattern + "}";
      }
    }
    if (bgp && bgp.length) {
      queryPatterns = queryPatterns.concat(SparqlBuilder.getQueryPattern(bgp));
    }
  }

  sparqlBuilder.addQueryPatterns(queryPatterns);
  console.log(sparqlBuilder.toString());
  return sparqlBuilder.toString();
}

export function setSelectedClass(className: string): Action {
  return {
    type: Actions.SET_SELECTED_CLASS,
    className: className,
  };
}
//
// selectedFacetValues: Immutable.Set(),
// selectedObjects: Immutable.Map()
//
export function setSelectedFacetValue(facetProp: string, key: string, checked: boolean): Action {
  return {
    type: Actions.SET_FACET_VALUE,
    facetName: facetProp,
    facetValueKey: key,
    checked: checked
  };
}
export function setSelectedObject(facetProp: string, facetObject: FacetProps["selectedObject"]): Action {
  return {
    type: Actions.SET_FACET_VALUE,
    facetName: facetProp,
    selectedFacetObject: facetObject
  };
}

var lastExecutedQuery: string;
export function getMatchingIris(state: GlobalState): any {
  const query = facetsToQuery(state);
  if (lastExecutedQuery === query) {
    //return a no-op. no use executing this query again (I think...)
    return () => {};
  }
  lastExecutedQuery = query;
  return {
    types: [Actions.GET_MATCHING_IRIS, Actions.GET_MATCHING_IRIS_SUCCESS, Actions.GET_MATCHING_IRIS_FAIL],
    promise: (client: ApiClient) =>
      client
        .req<any, SparqlJson>({
          sparqlSelect: query
        })
        .then(sparql => {
          return {
            iris: sparql.getValuesForVar('_r')
          };
        })
  };
}
export function getSelectedClass(facetState:StateRecordInterface ):string {
  return facetState.selectedClass
}

export function refreshFacets(state: GlobalState, forClass?: string): Action {
  if (!forClass || forClass.length === 0) forClass = getSelectedClass(state.facets);
  var facets: string[] = [];

  const classConf = CLASSES[forClass];
  if (!classConf) {
    throw new Error("Could not find class config for " + forClass);
  }
  var facets: string[] = classConf.facets
  return {
    type: Actions.REFRESH_FACETS,
    facetQueue: _.uniq(facets),
  };
}

export function getFacetProps(state: GlobalState, forProp: string): Action {
  const facetConf = FACETS[forProp];
  if (!facetConf) {
    throw new Error("Could not find facet config for " + forProp);
  }
  if (facetConf.facetValues) {
    //options are set directly, no need to fetch the options via sparql
    if (Array.isArray(facetConf.facetValues)) {
      return {
        type: Actions.FETCH_FACET_PROPS_SUCCESS,
        result: {
          optionList: facetConf.facetValues
        },
        facetName: facetConf.iri,
        sync:true
      };
    } else {
      return {
        type: Actions.FETCH_FACET_PROPS_SUCCESS,
        result: {
          optionObject: facetConf.facetValues
        },
        facetName: facetConf.iri,
        rand: Math.random(),
        sync:true
      } as any;
    }
  }
  const sparqlBuilder = SparqlBuilder.fromQueryString(FACETS[forProp].getFacetValuesQuery(forProp));
  const facetComponent = FacetComponent.getFacetFromString(facetConf.facetType);
  sparqlBuilder.distinct();
  facetComponent.prepareOptionsQuery(sparqlBuilder);
  sparqlBuilder.hasClasses(getSelectedClass(state.facets));
  return {
    types: [Actions.FETCH_FACET_PROPS, Actions.FETCH_FACET_PROPS_SUCCESS, Actions.FETCH_FACET_PROPS_FAIL],
    facetName: forProp,
    promise: (client: ApiClient) =>
      client
        .req<any, SparqlJson>({
          sparqlSelect: sparqlBuilder.toString()
        })
        .then(sparql => {
          const opts = facetComponent.getOptionsForQueryResult(sparql);
          if (Array.isArray(opts)) {
            return {
              optionList: opts
            };
          } else {
            return {
              optionObject: opts
            };
          }
        })
  };
}
