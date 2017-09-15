//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions } from "reducers";
import prefixes from 'prefixes'
const urlParse = require("url-parse");
import Tree from 'helpers/Tree'
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
    <${resource}> geo:hasGeometry ?geo .
    ?geo geo:asWKT ?wkt.
  }
#  BIND(<http://triply.cc/.well-known/someid> as ?geo)
#BIND("POLYGON ((5.3867792636470035 52.15796146765305, 5.386723176954902 52.15796559301798, 5.386691962510279 52.157944462233864, 5.386780418091053 52.157874491098816, 5.38678950768444 52.15787861659122, 5.386810434189914 52.1578620967409, 5.386657562712637 52.15777757357117, 5.386563583308939 52.157831285362654, 5.386560280673758 52.15782901139508, 5.386484846239821 52.157777069636204, 5.386560471095522 52.15773328055808, 5.386558293705004 52.15773057517209, 5.386554640339744 52.1577314649675, 5.386527123351346 52.15770799728109, 5.386564533828652 52.15769059671658, 5.38653628619387 52.15766623023286, 5.386405071815016 52.15772197303087, 5.386368874616448 52.157689040934855, 5.386497151628959 52.15763643496536, 5.386361511184788 52.15749896336344, 5.386461978363418 52.157459425785, 5.38651778642248 52.15752040937915, 5.386559828869124 52.15757012198637, 5.386588061833179 52.15759673545651, 5.386741604748836 52.15772535368668, 5.386942817647274 52.15783118724548, 5.386938696659336 52.15783446785186, 5.3867792636470035 52.15796146765305))"^^<http://www.opengis.net/ont/geosparql#wktLiteral> as ?wkt)
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


// function expandPaths(statements: Statement[], path: Path): Paths {
//   const toExpand = _.last(path);
//   if (toExpand.subject === toExpand.object) {
//     //extra check to avoid cyclic recursion
//     return [path];
//   }
//   var expandPathWith = statements.filter(
//     statement =>
//       statement.subject === toExpand.object &&
//       //extra check to avoid cyclic recursion
//       !path.find(s => s.subject === statement.object)
//   );
//   if (expandPathWith.length === 0) {
//     return [path];
//   }
//   return expandPathWith.map(statement => _.flatten(expandPaths(statements, path.concat([statement]))));
// }
// export function isBnode(term: string) {
//   return N3.Util.isBlank(term) || (N3.Util.isIRI(term) && term.indexOf(".well-known/genid") >= 0);
// }

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
// export function getPaths(statements: Statement[], forIri: string): Paths {
//   return statements
//     .filter(statement => statement.subject === forIri)
//     .map(statement => expandPaths(statements, [statement]))
//     .reduce<Paths>((result, _path) => {
//       return result.concat(_path);
//     }, []);
// }
//
// export type GroupedPaths = { [groupkey: string]: Paths };
// function getGroupKey(path: Path): string {
//   return path.reduce<string>((result, path) => {
//     return (result += path.predicate);
//   }, "");
// }
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
// export function groupPaths(paths: Paths): GroupedPaths {
//   return paths.reduce<GroupedPaths>((result, path) => {
//     const key = getGroupKey(path);
//     if (!result[key]) result[key] = [];
//     result[key].push(path);
//     return result;
//   }, {});
// }


// export function
export function getLabel(iri:string, tree:Tree): string {
  if (!N3.Util.isIRI(iri)) return null;
  const labelStatement = tree.getStatements().find(s => s.predicate === 'http://www.w3.org/2000/01/rdf-schema#label' && s.subject === iri);
  if (labelStatement && N3.Util.isLiteral(labelStatement.object)) return N3.Util.getLiteralValue(labelStatement.object);
  const lnameInfo = getLocalNameInfo(iri);
  if (lnameInfo.localName) {
    return lnameInfo.localName
  }
  return null;
}

export function getStatementsAsTree(forIri:string, statements:Statements) {
  return Tree.fromStatements(forIri,statements.toArray());
}

export interface RenderConfiguration {
  type?: 'textarea'
  size?: 'dynamic' | 'full'
}
export interface RenderSelection {
  label?:string,
  values:Tree[]//a node in the tree,
  config?: RenderConfiguration,

}
export type RenderSelector = (tree:Tree) => RenderSelection[];

/**
 * Render selectors
 */
const renderGeometry:RenderSelector = (t) => {
  const node = t.find([prefixes.geo + 'hasGeometry', null, prefixes.geo + 'asWKT']).limit(1).exec();
  if (node.length) {
    return <RenderSelection[]>[{
      // value: node[0]
      values: node
    }]
  }
}
const renderDescription:RenderSelector = (t) => {
  const node = t.find([prefixes.dcterms + 'description', null]).limit(1).exec();
  if (node.length) {
    return <RenderSelection[]>[{
      values: node,
      config: {
        type: 'textarea'
      }
    }]
  }
}
const renderLabel:RenderSelector = (t) => {
  const node = t.find([prefixes.rdfs + 'label', null]).limit(1).exec();
  if (node.length) {
    return <RenderSelection[]>[{
      // value: node[0]
      values: node
    }]
  }
}
const catchAll:RenderSelector = (t) => {
  const node = t.find().offset(1).exec();
  const groupedByPred = _.groupBy(node, (n) => n.getPredicate())
  const selections:RenderSelection[] = [];
  _.forEach(groupedByPred, (nodes, predicate) => {
    selections.push({
      label: getLabel(predicate,t),
      values: nodes,
      config: {
        size: 'dynamic'
      }
    })
  })
  return selections
}
export var RenderSelectors:RenderSelector[] = [
  // renderLabel,
  renderDescription,
  renderGeometry,
  catchAll
]




export function selectRenderer(tree:Tree, renderSelectors:RenderSelector[] = RenderSelectors):RenderSelection[] {
  // tree.getNquads().then(console.log)
  var renderers:RenderSelection[] = [];
  for (const renderSelector of  renderSelectors) {
    const renderer = renderSelector(tree);
    if (renderer && renderer.length) {
      renderers = renderers.concat(renderer);
    }
  }

  //make sure all renderers are unique. We don't want to draw these things twice
  return _.uniqBy(renderers, (r => r.values.map(value => value.getKey()).join()))
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
