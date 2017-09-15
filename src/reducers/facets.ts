//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions, GlobalState } from "reducers";
import {default as prefixes, getAsString} from 'prefixes'
import SparqlJson from 'helpers/SparqlJson'
// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_MATCHING_IRIS = "facetcheck/facets/GET_MATCHING_IRIS" as any,
  GET_MATCHING_IRIS_SUCCESS = "facetcheck/facets/GET_MATCHING_IRIS_SUCCESS" as any,
  GET_MATCHING_IRIS_FAIL = "facetcheck/facets/GET_MATCHING_IRIS_FAIL" as any
}

export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;

export var StateRecord = Immutable.Record(
  {
    matchingIris: Immutable.List<string>(),
    fetchResources: 0
  },
  "facets"
);
export var initialState = new StateRecord();
export type StateRecordInterface = typeof initialState;

export type ResourceDescriptions = Immutable.OrderedMap<string, Statements>;
//
//
//
// const initialState:State = {
//   lastAddedIri: null,
//   resourceDescriptions: {},
//   fetchingResourceDescriptions: 0
// }

export interface Action extends GlobalActions<Actions> {
  forIri: string;
  // result?: Job & Models.Dataset,
}

export function reducer(state = initialState, action: Action) {
  // const assign = (modifiedState:State) => _.assign<State>({}, state, modifiedState)
  // const addResourceDescription = (iri:string, descr:N3.Statement[]) => {
  //   const newState = _.assign<State>({}, state);
  //   newState.lastAddedIri = iri;
  //   newState.resourceDescriptions[iri] = descr;
  //   newState.fetchingResourceDescriptions = state.fetchingResourceDescriptions - 1;
  //   return newState;
  // }
  switch (action.type) {
    case Actions.GET_MATCHING_IRIS:
      return state.update("fetchResources", num => num + 1);
    case Actions.GET_MATCHING_IRIS_FAIL:
      return state.update("fetchResources", num => num - 1);
    case Actions.GET_MATCHING_IRIS_SUCCESS:
      return state.update("fetchResources", num => num - 1).set("matchingIris", Immutable.List(action.result))

    // case FacetActions.RESET_MATCHING_IRIS:
    //   return assign({resourceDescriptions: {}})
    // case FacetActions.GET_MATCHING_IRIS_SUCCESS:
    //   //remove resource descriptions that we shouldnt show.
    //   //saves mem as well
    //   if (!action.result || !action.result.length) return state;
    //   const newState = _.assign<State>({}, state);
    //   newState.resourceDescriptions = {};
    //   _.keys(state.resourceDescriptions).forEach(iri => {
    //     if (action.result.indexOf(iri) >= 0) {
    //       newState.resourceDescriptions[iri] = state.resourceDescriptions[iri]
    //     }
    //   })

    // return newState;
    default:
      return state;
  }
}


export function facetsToQuery(state:GlobalState) {
  var facetPatterns:string[] = [];
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
  return `${getAsString()}
  SELECT ?_r WHERE {
    BIND(<https://cultureelerfgoed.nl/id/monument/511321> as ?_r)
  } LIMIT 20

  `
}


export function getMatchingIris(state:GlobalState):any {

    return {
      types: [Actions.GET_MATCHING_IRIS, Actions.GET_MATCHING_IRIS_SUCCESS, Actions.GET_MATCHING_IRIS_FAIL],
      promise: (client:ApiClient) => client.req<any, SparqlJson>({
        sparqlSelect: facetsToQuery(state),
      }).then((sparql) => {
        console.log(sparql)
        return sparql.getValuesForVar('_r');
      })
    };


};
