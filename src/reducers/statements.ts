//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions } from "reducers";
const urlParse = require("url-parse");
// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_STATEMENTS = "facetcheck/statements/GET_STATEMENTS" as any,
  GET_STATEMENTS_SUCCESS = "facetcheck/statements/GET_STATEMENTS_SUCCESS" as any,
  GET_STATEMENTS_FAIL = "facetcheck/statements/GET_STATEMENTS_FAIL" as any
}
const PREFIXES = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX brt: <http://brt.basisregistraties.overheid.nl/def/top10nl#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
`;
export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;

export var StateRecord = Immutable.Record(
  {
    resourceDescriptions: Immutable.OrderedMap<string, Statements>(),
    fetchRequests: 0
  },
  "statements"
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
    case Actions.GET_STATEMENTS:
      return state.update("fetchRequests", num => num + 1);
    case Actions.GET_STATEMENTS_FAIL:
      return state.update("fetchRequests", num => num - 1);
    case Actions.GET_STATEMENTS_SUCCESS:
      return state.update("fetchRequests", num => num - 1).update("resourceDescriptions", resourceDescriptions => {
        return resourceDescriptions.set(action.forIri, Immutable.List<Statement>(action.result));
      });

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

export function getStatements(resource: string): Action {
  var projectPattern = `
    <${resource}> ?x ?y.
    <${resource}> brt:lijnGeometrie ?brtGeo .
    ?brtGeo geo:asWKT ?wkt.
    <${resource}> geo:hasGeometry ?geo .
    ?geo geo:asWKT ?wkt.
    ?y rdfs:label ?yLabel .

  `;
  var selectPattern = `
  <${resource}> ?x ?y.
  OPTIONAL {
    ?y rdfs:label ?yLabel
  }
  OPTIONAL {
    ?x rdfs:label ?xLabel
  }
  OPTIONAL {
    <${resource}> brt:lijnGeometrie ?brtGeo .
    ?brtGeo geo:asWKT ?wkt.
  }
  OPTIONAL {
    <${resource}> geo:hasGeometry ?geo .
    ?geo geo:asWKT ?wkt.
  }
  `;

  return {
    types: [Actions.GET_STATEMENTS, Actions.GET_STATEMENTS_SUCCESS, Actions.GET_STATEMENTS_FAIL],
    promise: (client: ApiClient) =>
      client.req({
        sparqlConstruct: `${PREFIXES} CONSTRUCT { ${projectPattern} } WHERE { ${selectPattern} } `
      }),
    forIri: resource
  };
}

export type Path = Statement[];
export type Paths = Path[];


function expandPaths(statements: Statement[], path: Path): Paths {
  const toExpand = _.last(path);
  if (toExpand.subject === toExpand.object) {
    //extra check to avoid cyclic recursion
    return [path];
  }
  var expandPathWith = statements.filter(
    statement =>
      statement.subject === toExpand.object &&
      //extra check to avoid cyclic recursion
      !path.find(s => s.subject === statement.object)
  );
  if (expandPathWith.length === 0) {
    return [path];
  }
  return expandPathWith.map(statement => _.flatten(expandPaths(statements, path.concat([statement]))));
}
export function isBnode(term: string) {
  return N3.Util.isBlank(term) || (N3.Util.isIRI(term) && term.indexOf(".well-known/genid") >= 0);
}

/**
 * Group this bunch of triples by path. I.e., the last triple is always the value, the first triple always contains info
 * about the iri we're showing in resourceDescription
 * Example input:
 * <http://laurens> <http://hasName> _:bnode.
 * _:bnode. <firstname> "laurens"
 * _:bnode. <lastname> "rietveld"
 * <http://laurens> <http://hasAge> "34" .
 *
 * Example output:
 *
[
 [
  {subject: "http://laurens", predicate: "http://hasName", object: "_:bnode"},
  {subject: "bnode", predicate: "firstname", object: "laurens"},
 ],
 [
  {subject: "http://laurens", predicate: "http://hasName", object: "_:bnode"},
  {subject: "bnode", predicate: "lastname", object: "rietveld"},
 ],
  {subject: "http://laurens", predicate: "http://hasAge", object: "34"},
 ]
]
 */
export function getPaths(statements: Statement[], forIri: string): Paths {
  return statements
    .filter(statement => statement.subject === forIri)
    .map(statement => expandPaths(statements, [statement]))
    .reduce<Paths>((result, _path) => {
      return result.concat(_path);
    }, []);
}

export type GroupedPaths = { [groupkey: string]: Paths };
function getGroupKey(path: Path): string {
  return path.reduce<string>((result, path) => {
    return (result += path.predicate);
  }, "");
}
/**
 * Group paths by 'groupKey'. Values of the grouped paths are rendered together under the same key
 * Example input:
 * <http://laurens> <http://hasName> _:bnode.
 * _:bnode. <firstname> "laurens"
 * _:bnode. <lastname> "rietveld"
 * <http://laurens> <http://hasName> _:bnode2.
 * _:bnode2. <firstname> "laurens2"
 * _:bnode2. <lastname> "rietveld2"
 * <http://laurens> <http://hasAge> "34" .
 *
 * Example output:
 *
{
 "http://hasNamefirstname": [
   [
    {subject: "http://laurens", predicate: "http://hasName", object: "_:bnode"},
    {subject: "bnode", predicate: "firstname", object: "laurens"},
   ],
   [
    {subject: "http://laurens", predicate: "http://hasName", object: "_:bnode2"},
    {subject: "bnode2", predicate: "firstname", object: "laurens2"},
   ],
 ],
 "http://hasNamelastname": [
   [
    {subject: "http://laurens", predicate: "http://hasName", object: "_:bnode"},
    {subject: "bnode", predicate: "lastname", object: "rietveld"},
   ],
   [
    {subject: "http://laurens", predicate: "http://hasName", object: "_:bnode2"},
    {subject: "bnode2", predicate: "lastname", object: "rietveld2"},
   ],
 ],
 "http://hasAge": [
   [
    {subject: "http://laurens", predicate: "http://hasAge", object: "34"},
   ]
 ],
}
 */
export function groupPaths(paths: Paths): GroupedPaths {
  return paths.reduce<GroupedPaths>((result, path) => {
    const key = getGroupKey(path);
    if (!result[key]) result[key] = [];
    result[key].push(path);
    return result;
  }, {});
}

export function getLabel(iri:string, statements: Statements): string {
  if (!N3.Util.isIRI(iri)) return null;
  const labelStatement = statements.find(s => s.predicate === 'http://www.w3.org/2000/01/rdf-schema#label' && s.subject === iri);
  if (labelStatement && N3.Util.isLiteral(labelStatement.object)) return N3.Util.getLiteralValue(labelStatement.object);
  const lnameInfo = getLocalNameInfo(iri);
  if (lnameInfo.localName) {
    return lnameInfo.localName
  }
  return null;
}


/**
 * borrowed from triply-node-utils
 */
function getLocalNameInfo(iri: string):{iri:string, localName?:string} {
  const getLastSlashIndex = (pathname: string, offset?: number): number => {
    if (offset === undefined) offset = pathname.length;
    const i = pathname.lastIndexOf("/", offset);
    if (i >= 0 && i === pathname.length - 1) {
      //this is the last char. For paths with a trailing slash,
      //we want the parent pathname as localname, so go back in the string
      if (offset < 0) return i;
      return getLastSlashIndex(pathname, offset - 1);
    }
    return i;
  };
  const parsed = urlParse(iri);

  if (parsed.hash.length > 1) {
    var hashContent = parsed.hash.substr(1);
    parsed.set("hash", "#");
    return {
      iri: parsed.toString(),
      localName: hashContent
    };
  }

  const i = getLastSlashIndex(parsed.pathname);

  if (i >= 0) {
    const localName:string = parsed.pathname.substr(i + 1) + parsed.query + parsed.hash;
    if (localName && localName.length) {
      parsed.set("pathname", parsed.pathname.substr(0, i + 1));
      parsed.set("query", "");
      parsed.set("hash", "");
      return {
        iri: parsed.toString(),
        localName: localName
      };
    }
  }

  return { iri: iri };
}
