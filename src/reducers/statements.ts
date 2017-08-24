//external dependencies
import * as _ from 'lodash'
import * as N3 from 'n3'
import SparqlJson from 'helpers/SparqlJson'
import * as Immutable from 'immutable'
import ApiClient from 'helpers/ApiClient'
import {GlobalActions} from 'reducers'
// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_STATEMENTS = 'facetcheck/statements/GET_STATEMENTS' as any,
  GET_STATEMENTS_SUCCESS = 'facetcheck/statements/GET_STATEMENTS_SUCCESS' as any,
  GET_STATEMENTS_FAIL = 'facetcheck/statements/GET_STATEMENTS_FAIL' as any,
}
const PREFIXES = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
`
export type Statement = N3.Statement;


export var StateRecord = Immutable.Record({
  resourceDescriptions: Immutable.OrderedMap<string,Immutable.List<Statement>>(),
  fetchRequests: 0
},'statements')
export var initialState = new StateRecord();
export type StateRecordInterface = typeof initialState;

export type ResourceDescriptions = Immutable.OrderedMap<string,Immutable.List<Statement>>
//
//
//
// const initialState:State = {
//   lastAddedIri: null,
//   resourceDescriptions: {},
//   fetchingResourceDescriptions: 0
// }

export interface Action extends GlobalActions<Actions> {
  forIri: string
  // result?: Job & Models.Dataset,
}

export function reducer(state = initialState, action:Action) {
  // const assign = (modifiedState:State) => _.assign<State>({}, state, modifiedState)
  // const addResourceDescription = (iri:string, descr:N3.Statement[]) => {
  //   const newState = _.assign<State>({}, state);
  //   newState.lastAddedIri = iri;
  //   newState.resourceDescriptions[iri] = descr;
  //   newState.fetchingResourceDescriptions = state.fetchingResourceDescriptions - 1;
  //   return newState;
  // }
  switch (action.type) {

    case Actions.GET_STATEMENTS:
      return state.update('fetchRequests', num => num+1);
    case Actions.GET_STATEMENTS_FAIL:
      return state.update('fetchRequests', num => num-1);
    case Actions.GET_STATEMENTS_SUCCESS:
      return state.update('fetchRequests', num => num-1)
        .update('resourceDescriptions', (resourceDescriptions) => {
          return resourceDescriptions.set(action.forIri, Immutable.List<Statement>(action.result));
        })

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



export function getStatements(resource:string):Action {
  var projectPattern = `
    <${resource}> ?x ?y.
    <${resource}> brt:lijnGeometrie ?brtGeo .
    ?brtGeo geo:asWKT ?wkt.
    <${resource}> geo:hasGeometry ?geo .
    ?geo geo:asWKT ?wkt.
    ?y rdfs:label ?label .

  `
  var selectPattern = `
  <${resource}> ?x ?y.
  OPTIONAL {
    ?y rdfs:label ?label
  }
  OPTIONAL {
    <${resource}> brt:lijnGeometrie ?brtGeo .
    ?brtGeo geo:asWKT ?wkt.
  }
  OPTIONAL {
    <${resource}> geo:hasGeometry ?geo .
    ?geo geo:asWKT ?wkt.
  }
  `


  return {
    types: [Actions.GET_STATEMENTS, Actions.GET_STATEMENTS_SUCCESS, Actions.GET_STATEMENTS_FAIL],
    promise: (client:ApiClient) => client.req({
      sparqlConstruct: `${PREFIXES} CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `,
    }),
    forIri: resource
  };
};
