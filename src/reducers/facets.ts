//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "../helpers/ApiClient";
import { GlobalActions, GlobalState } from "../reducers";

import {
  FacetValue,
  FacetOptionsList,
  FacetOptionsObject,
  FacetOptionsNlProvinces,
  FacetOptionsSearch
} from "../facetConfUtils";
import * as ReduxObservable from "redux-observable";
import { map, filter } from "rxjs/operators";
import * as Redux from "redux";
import { Facet as FacetComponent } from "../components";
import { FACETS, CLASSES, CONFIG, getPrefixes, getPageSize, logEnabled } from "../facetConf";
import SparqlBuilder from "../helpers/SparqlBuilder";
import * as sparqljs from "sparqljs";
import { default as SparqlJson } from "../helpers/SparqlJson";
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
  REFRESH_FACETS_SUCCESS = "facetcheck/facets/REFRESH_FACETS_SUCCESS" as any,
  REFRESH_FACETS_FAIL = "facetcheck/facets/REFRESH_FACETS_FAIL" as any,
  SET_FACET_VALUE = "facetcheck/facets/SET_FACET_VALUE" as any
  // GET_FACET_CONFIG = "facetcheck/facets/GET_FACET_CONFIG" as any,
  // GET_FACET_CONFIG_SUCCESS = "facetcheck/facets/GET_FACET_CONFIG_SUCCESS" as any,
  // GET_FACET_CONFIG_FAIL = "facetcheck/facets/GET_FACET_CONFIG_FAIL" as any
}

export type Statement = N3.Quad;
export type Statements = Immutable.List<Statement>;

// export type FacetValueOptions = Partial<FacetProvinces.Options & FacetMultiSelect.Options & FacetSlider.Options>;
export interface FacetProps {
  iri: string;
  selectedFacetValues: Immutable.Set<string>;

  //we're never modifying props in these objects, but always overwriting it completely
  //so no use using an immutable model here
  optionList: FacetOptionsList;
  optionObject: FacetOptionsObject | FacetOptionsNlProvinces | FacetOptionsSearch;
  // optionObject: { [key: string]: FacetValue  };
  selectedObject: { [key: string]: number };
  error: string;
}

export var Facet = Immutable.Record<FacetProps>(
  {
    iri: null,
    selectedFacetValues: Immutable.Set(),
    optionList: null,
    optionObject: null,
    selectedObject: null,
    error: null
  },
  "facetValues"
);
export type Facet = Immutable.Record.Inst<FacetProps>;

var defaultClass: string;
if (CONFIG.defaultClass) {
  if (!CLASSES.find(c => c.iri === CONFIG.defaultClass)) {
    console.warn(`Cannot find class configuration for class that is set as default (${CONFIG.defaultClass})`);
    defaultClass = CLASSES[0].iri;
  } else {
    defaultClass = CONFIG.defaultClass;
  }
} else {
  defaultClass = CLASSES[0].iri;
}

export var StateRecord = Immutable.Record(
  {
    matchingIris: Immutable.List<string>(),
    facetLabels: Immutable.Map<string, string>(),
    fetchResources: 0,
    nextPageOffset: 0,
    hasNextPage: false,
    updateFacetInfoQueue: Immutable.List<string>(),
    selectedClass: defaultClass,
    facets: Immutable.OrderedMap<string, Facet>()
  },
  "facets"
);
export var initialState = new StateRecord();

export type FacetState = typeof initialState;
export type FacetsProps = FacetState["facets"];

export interface Action extends GlobalActions<Actions> {
  className?: string;
  facetName?: string;
  result?: {
    optionList?: FacetProps["optionList"];
    optionObject?: FacetProps["optionObject"];
    iris?: string[];
    labelKeys?: { [key: string]: string };
    hasNextPage?: boolean;
  };
  offset?: number;
  facetQueue?: string[];
  facetValueKey?: string;
  checked?: boolean;
  selectedFacetObject?: FacetProps["selectedObject"];
  sync?: boolean;
}

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case Actions.GET_MATCHING_IRIS:
      var result = state.update("fetchResources", num => num + 1).set("nextPageOffset", action.offset);
      if (!action.offset) result = result.set("matchingIris", Immutable.List<string>());

      return result;
    case Actions.GET_MATCHING_IRIS_FAIL:
      return state.update("fetchResources", num => num - 1);
    case Actions.GET_MATCHING_IRIS_SUCCESS:
      var result = state
        .update("fetchResources", num => num - 1)
        .set("hasNextPage", action.result.hasNextPage)
        .update("matchingIris", iris => iris.concat(action.result.iris));
      if (action.result.hasNextPage) {
        var result = result.update("nextPageOffset", offset => (offset += action.result.iris.length));
      }
      return result;
    case Actions.SET_SELECTED_CLASS:
      return state.set("nextPageOffset", 0).set("selectedClass", action.className);
    case Actions.SET_FACET_VALUE:
      return state.set("nextPageOffset", 0).update("facets", facet => {
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
      return state
        .set("facets", Immutable.OrderedMap()) //clear old facet configs
        .set("matchingIris", Immutable.List()) //clear old facet configs
        .set("updateFacetInfoQueue", Immutable.List(action.facetQueue));
    case Actions.REFRESH_FACETS_SUCCESS:
      return state.update("facetLabels", map => {
        return map.merge(action.result.labelKeys);
      });
    case Actions.FETCH_FACET_PROPS:
      return state.update("updateFacetInfoQueue", list => {
        const i = list.indexOf(action.facetName);
        if (i >= 0) return list.delete(list.indexOf(action.facetName));
        return list;
      });
    case Actions.FETCH_FACET_PROPS_FAIL:
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
        return facet
          .update(action.facetName, new Facet(), _vals => {
            return _vals.withMutations(vals => {
              if (action.type === Actions.FETCH_FACET_PROPS_FAIL) {
                vals.set("error", action.message);
              }
              vals.set("iri", action.facetName);
              if (action.result && action.result.optionList) {
                vals.set("optionList", action.result.optionList);
              }
              if (action.result && action.result.optionObject) {
                vals.set("optionObject", action.result.optionObject);
              }
              if (action.error) vals.set("error", action.error);
            });
          })
          .sortBy((_val, key) => {
            return facetSorting.indexOf(key);
          });
      });
    default:
      return state;
  }
}

export type Action$ = ReduxObservable.ActionsObservable<any>;
export type Store = Redux.Store<GlobalState>;
export var epics: Array<ReduxObservable.Epic<any, Action, GlobalState>> = [
  //update matching iris when classes change
  (action$, store) => {
    return action$.pipe(
      ReduxObservable.ofType(Actions.SET_SELECTED_CLASS),
      map(action => {
        //facet settings might need removing before fetching the matching iris. So make sure we don't call one before the other
        // store.dispatch(getMatchingIris(store.getState()));
        return refreshFacets(store.value.facets.facetLabels, action.className);
      })
    );
  },
  //update matching iris when facets change
  (action$, store) => {
    return action$.pipe(
      ReduxObservable.ofType(Actions.SET_FACET_VALUE),
      map(_action => {
        return getMatchingIris(
          store.value.facets.facets,
          store.value.facets.selectedClass,
          store.value.facets.nextPageOffset
        );
      })
    );
  },
  //update matching iris when facets are refreshed (this triggers new resourcedescriptions as well)
  (action$, store) => {
    return action$.pipe(
      ReduxObservable.ofType(Actions.REFRESH_FACETS),
      map((_action: Action) => {
        return getMatchingIris(
          store.value.facets.facets,
          store.value.facets.selectedClass,
          store.value.facets.nextPageOffset
        );
      })
    );
  },

  //update facet information when facets are added to the queue
  (action$, store) => {
    return action$.pipe(
      ReduxObservable.ofType(Actions.REFRESH_FACETS),
      map((action: Action) => {
        return getFacetProps(store.value, action.facetQueue[0]);
      })
    );
  },
  //update facet information when another one finished
  (action$, store) => {
    return action$.pipe(
      ReduxObservable.ofType(Actions.FETCH_FACET_PROPS_SUCCESS),
      filter(() => {
        return !!store.value.facets.updateFacetInfoQueue.size;
      }),
      map((_action: Action) => {
        return getFacetProps(store.value, store.value.facets.updateFacetInfoQueue.first());
      })
    );
  }
];
export function getFacetsForClass(selectedClass: string): string[] {
  const classConf = CLASSES.find(c => c.iri === selectedClass);
  if (!classConf) throw new Error("No class definition found for " + selectedClass);
  return classConf.facets;
}
export function facetsToQuery(facets: FacetState["facets"], selectedClass: string, nextPageOffset: number) {
  const sparqlBuilder = SparqlBuilder.get(getPrefixes());
  sparqlBuilder
    .vars("?_r")
    .limit(getPageSize() + 1)
    .offset(nextPageOffset)
    .distinct();

  /**
   * Add classes
   */
  // const selectedClass = getSelectedClass(facetState);

  const classConf = CLASSES.find(c => c.iri === selectedClass);
  if (!classConf) {
    throw new Error("Could not find class config for " + selectedClass);
  }
  if (!classConf.facets.length) {
    throw new Error(`Class ${selectedClass} does not have any configured facets`);
  }
  if (classConf.classToQueryPattern) {
    sparqlBuilder.addQueryPatterns(
      SparqlBuilder.getQueryPattern("{ " + classConf.classToQueryPattern(selectedClass) + "}")
    );
  } else {
    sparqlBuilder.hasClasses(selectedClass);
  }

  /**
   * Get facets we might need to integrate in this query
   */
  var facetsToCheck: string[] = getFacetsForClass(selectedClass).filter(f => {
    const facetsValues = facets.get(f);
    if (!facetsValues) return false;
    return !!_.size(facetsValues.selectedObject) || !!facetsValues.selectedFacetValues.size;
  });

  var queryPatterns: sparqljs.Pattern[] = [];
  for (const facetKey of facetsToCheck) {
    const facetConfig = FACETS[facetKey];
    const facetIri = facetKey;
    const facetsValues = facets.get(facetKey);
    var bgp = "";
    if (facetsValues.selectedFacetValues.size) {
      var listOfFacetValues: Array<FacetValue | number> = facetsValues.optionList;
      // if (facetsValues.optionList) {
      //   listOfFacetValues = facetsValues.optionList
      // }
      if (!listOfFacetValues) {
        //cast to any, because provinces valuesmap will complain otherwise
        listOfFacetValues = _.values<FacetValue | number>(facetsValues.optionObject as any);
      }
      const pattern = (facetConfig as any).facetToQueryPatterns(facetIri, listOfFacetValues.filter((v: any) =>
        facetsValues.selectedFacetValues.has(v.value)
      ) as any);
      if (pattern && pattern.length) bgp += `{ ${pattern} }`;
    } else {
      //just pass the object
      const pattern = (facetConfig as any).facetToQueryPatterns(facetIri, facetsValues.selectedObject);
      if (pattern && pattern.length) {
        bgp += "{" + pattern + "}";
      }
    }
    if (bgp && bgp.length) {
      queryPatterns = queryPatterns.concat(SparqlBuilder.getQueryPattern(bgp));
    }
  }

  sparqlBuilder.addQueryPatterns(queryPatterns);

  // Added in debug state and made printing of colors possible.
  if (logEnabled()) {
    console.groupCollapsed("%cQuerying for matching IRIs", "color: #133201; font-weight: bolder;");
    console.info("%c" + sparqlBuilder.toString(), "color: black; ");
    console.groupEnd();
  }
  return sparqlBuilder.toString();
}

export function setSelectedClass(className: string): Action {
  return {
    type: Actions.SET_SELECTED_CLASS,
    className: className
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

export function setSelectedSearchString(facetProp: string, searchObject: FacetOptionsSearch) {
  return {
    type: Actions.SET_FACET_VALUE,
    facetName: facetProp,
    selectedFacetObject: searchObject
  };
}

var lastExecutedQuery: string;
export function getMatchingIris(facets: FacetState["facets"], selectedClass: string, nextPageOffset: number): any {
  try {
    const query = facetsToQuery(facets, selectedClass, nextPageOffset);
    if (lastExecutedQuery === query) {
      //return a no-op. no use executing this query again (I think...)
      return () => {};
    }
    lastExecutedQuery = query;
    return {
      offset: nextPageOffset,
      types: [Actions.GET_MATCHING_IRIS, Actions.GET_MATCHING_IRIS_SUCCESS, Actions.GET_MATCHING_IRIS_FAIL],
      promise: (client: ApiClient) =>
        client
          .req<any, SparqlJson>({
            sparqlSelect: query
          })
          .then(sparql => {
            return {
              iris: sparql.getValuesForVar("_r").slice(0, getPageSize()),
              hasNextPage: sparql.getValues().length > getPageSize()
            };
          })
    };
  } catch (e) {
    console.error("Failed querying for matching IRIs", e);
    return {
      type: Actions.GET_MATCHING_IRIS_FAIL,
      error: "Failed to query for resource that match these facets: " + e.message
    };
  }
}
export function getSelectedClass(facetState: FacetState): string {
  return facetState.selectedClass;
}

export function refreshFacets(facetLabels: FacetState["facetLabels"], forClass: string): Action {
  try {
    if (!forClass)
      throw new Error(
        "No class is selected. Either no default class is selected in the class config, or something else is wrong"
      );
    var facets: string[] = [];

    const classConf = CLASSES.find(c => c.iri === forClass);
    if (!classConf) {
      throw new Error("Could not find class config for " + forClass);
    }
    var facets: string[] = classConf.facets;
    if (!facets.length) {
      throw new Error(`Class ${forClass} does not have any configured facets`);
    }
    const fetchLabelsFor: string[] = facets.filter(f => FACETS[f] && !("label" in FACETS[f]) && !facetLabels.has(f));
    const getLabelQuery = () => {
      if (fetchLabelsFor.length === 0) return "SELECT * WHERE {?s ?p ?o} LIMIT 0";
      return `
      SELECT ${_.keys(fetchLabelsFor)
        .map(k => "?" + k)
        .join(" ")} WHERE {
        ${fetchLabelsFor
          .map((val, key) => {
            return `OPTIONAL {
            <${val}> rdfs:label ?${key} .
          }`;
          })
          .join(" ")}
      } LIMIT 1`;
    };
    return {
      types: [Actions.REFRESH_FACETS, Actions.REFRESH_FACETS_SUCCESS, Actions.REFRESH_FACETS_FAIL],
      facetQueue: _.uniq(facets),
      promise: (client: ApiClient) =>
        client
          .req<any, SparqlJson>({
            sparqlSelect: getLabelQuery()
          })
          .then(sparql => {
            const vals = sparql.getValues()[0];
            var labels: { [key: string]: string } = {};
            fetchLabelsFor.forEach((label, key) => {
              labels[label] = vals[key] ? vals[key].value : null;
            });
            return {
              labelKeys: labels
            };
          })
    };
  } catch (e) {
    console.error(e);
    return {
      type: Actions.REFRESH_FACETS_FAIL,
      message: e.message
    };
  }
}

export function getFacetProps(state: GlobalState, forProp: string): Action {
  try {
    const facetConf = FACETS[forProp];
    if (!facetConf) {
      throw new Error("Could not find facet config for " + forProp);
    }

    if (facetConf.facetType === "search") {
      // search props are always the same
      return {
        type: Actions.FETCH_FACET_PROPS_SUCCESS,
        facetName: forProp,
        result: {
          optionObject: { searchString: "" }
        },
        sync: true
      };
    }

    if (facetConf.facetValues) {
      //options are set directly, no need to fetch the options via sparql
      if (Array.isArray(facetConf.facetValues)) {
        return {
          type: Actions.FETCH_FACET_PROPS_SUCCESS,
          facetName: forProp,
          result: {
            optionList: facetConf.facetValues
          },
          sync: true
        };
      } else {
        return {
          type: Actions.FETCH_FACET_PROPS_SUCCESS,
          facetName: forProp,
          result: {
            optionObject: facetConf.facetValues
          },
          sync: true
        };
      }
    }
    const sparqlBuilder = SparqlBuilder.fromQueryString(facetConf.getFacetValuesQuery(forProp));
    const facetComponent = FacetComponent.getFacetFromString(facetConf.facetType);
    sparqlBuilder.distinct();
    facetComponent.prepareOptionsQuery(sparqlBuilder);
    sparqlBuilder.hasClasses(getSelectedClass(state.facets));

    const sparqlString = sparqlBuilder.toString();

    // Added in debug state and made printing of colors possible.
    if (logEnabled()) {
      console.groupCollapsed(
        "%c" + `Querying for %c` + `${facetConf.label}` + `%c facet values`,
        "color: #1690c6; font-weight: normal;",
        "color: #1690c6; font-weight: normal; text-decoration: underline;",
        "color: #1690c6; font-weight: normal;"
      );
      console.info("%c" + sparqlString, "color: black");
      console.groupEnd();
    }
    return {
      types: [Actions.FETCH_FACET_PROPS, Actions.FETCH_FACET_PROPS_SUCCESS, Actions.FETCH_FACET_PROPS_FAIL],
      facetName: forProp,
      promise: (client: ApiClient) =>
        client
          .req<any, SparqlJson>({
            sparqlSelect: sparqlString
          })
          .then(sparql => {
            if (!sparql.hasResult())
              throw new Error("No SPARQL results returned when querying the facet properties of " + forProp);
            else {
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
            }
          })
    };
  } catch (e) {
    console.error(e);
    return {
      type: Actions.FETCH_FACET_PROPS_FAIL,
      facetName: forProp,
      error: <any>`Failed to fetch facet props for ${forProp} (${e.message})`
    };
  }
}
