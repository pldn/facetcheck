//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions, GlobalState } from "reducers";
import { FACETS, CLASSES, FacetValue } from "facetConf";
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
  TOGGLE_CLASS = "facetcheck/facets/TOGGLE_CLASS" as any,
  FETCH_FACET_PROPS = "facetcheck/facets/FETCH_FACET_PROPS" as any,
  FETCH_FACET_PROPS_SUCCESS = "facetcheck/facets/FETCH_FACET_PROPS_SUCCESS" as any,
  FETCH_FACET_PROPS_FAIL = "facetcheck/facets/FETCH_FACET_PROPS_FAIL" as any,
  QUEUE_FACET_UPDATE = "facetcheck/facets/QUEUE_FACET_UPDATE" as any,
  SET_FACET_VALUE = "facetcheck/facets/SET_FACET_VALUE" as any
  // GET_FACET_CONFIG = "facetcheck/facets/GET_FACET_CONFIG" as any,
  // GET_FACET_CONFIG_SUCCESS = "facetcheck/facets/GET_FACET_CONFIG_SUCCESS" as any,
  // GET_FACET_CONFIG_FAIL = "facetcheck/facets/GET_FACET_CONFIG_FAIL" as any
}

export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;
export type IriToClassMapping = { [iri: string]: string };

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
    matchingIris: Immutable.OrderedMap<string, string>(), //matched IRI -> className of that iri
    fetchResources: 0,
    updateFacetInfoQueue: Immutable.List<string>(),
    classes: <SelectedClasses>Immutable.OrderedMap<string, boolean>().withMutations(m => {
      //populate selectedClasses (taken from object here, so no guarantees on sorting)
      for (const c of Object.keys(CLASSES)) {
        m.set(c, CLASSES[c].default);
      }
      return m;
    }),
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
    iriToClassMapping?: IriToClassMapping;
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
        .set("matchingIris", Immutable.OrderedMap<string, string>(<any>action.result.iriToClassMapping));
    case Actions.TOGGLE_CLASS:
      return state.setIn(<[keyof StateRecordInterface, string]>["classes", action.className], action.checked);
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
    case Actions.QUEUE_FACET_UPDATE:
      return state.set("updateFacetInfoQueue", Immutable.List(action.facetQueue));
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
      const facetSorting = getFacetsForClasses(getSelectedClasses(state));
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
    return action$.ofType(Actions.TOGGLE_CLASS).map((action: Action) => {
      store.dispatch(getMatchingIris(store.getState()));
      store.dispatch(queueFacetUpdates(store.getState(), action.className));
      return () => {}; //empty action
    });
  },
  //update matching iris when facets change
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.SET_FACET_VALUE).map((action: Action) => {
      store.dispatch(getMatchingIris(store.getState()));
      return () => {}; //empty action
    });
  },

  //update facet information when facets are added to the queue
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.QUEUE_FACET_UPDATE).map((action: Action) => {
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
export function getFacetsForClasses(selectedClasses:string[]):string[] {
  var facetsToCheck: string[] = [];
  for (const className of selectedClasses) {
    facetsToCheck = facetsToCheck.concat(CLASSES[className].facets);
  }
  return _.uniq(facetsToCheck)
}
export function facetsToQuery(state: GlobalState) {
  const sparqlBuilder = SparqlBuilder.get(prefixes);
  sparqlBuilder
    .vars("?_r", "?_type")
    .limit(2)
    .distinct();

  /**
   * Add classes
   */
  const selectedClasses = getSelectedClasses(state.facets);
  sparqlBuilder.hasClasses(...selectedClasses);
  //also return which classes match. That way, we know for this particular IRI how to render it
  //as one iri can have multiple classes, we have to join this variable with the list of selected classes when
  //we get the query result
  sparqlBuilder.addQueryPatterns([
    { type: "bgp", triples: [{ subject: "?_r", predicate: prefix("rdf", "type"), object: "?_type" }] }
  ]);

  /**
   * Get facets we might need to integrate in this query
   */
  var facetsToCheck: string[] = getFacetsForClasses(selectedClasses).filter(f => {
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

export function toggleClass(className: string, checked: boolean): Action {
  return {
    type: Actions.TOGGLE_CLASS,
    className: className,
    checked: checked
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
            iriToClassMapping: sparql.getValues().reduce<IriToClassMapping>(function(mapping, binding) {
              if (binding._r) {
                if (binding._type && getSelectedClasses(state.facets).indexOf(binding._type.value) >= 0) {
                  //it's a type we recognize (i.e., we can render it)
                  mapping[binding._r.value] = binding._type.value;
                }
              }
              return mapping;
            }, {})
          };
        })
  };
}
export function getSelectedClasses(facetState:StateRecordInterface ) {
  return facetState.classes
    .filter(val => val)
    .keySeq()
    .toArray();
}

export function queueFacetUpdates(state: GlobalState, ...forClasses: string[]): Action {
  if (!forClasses || forClasses.length === 0) forClasses = getSelectedClasses(state.facets);
  var facets: string[] = [];
  for (const forClass of forClasses) {
    const classConf = CLASSES[forClass];
    if (!classConf) {
      throw new Error("Could not find class config for " + forClass);
    }
    facets = facets.concat(classConf.facets);
  }
  return {
    type: Actions.QUEUE_FACET_UPDATE,
    facetQueue: _.uniq(facets)
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
  sparqlBuilder.hasClasses(...getSelectedClasses(state.facets));
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
