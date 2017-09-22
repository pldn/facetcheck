//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions } from "reducers";
import {default as prefixes, getAsString} from 'prefixes'
const urlParse = require("url-parse");
import Tree from 'helpers/Tree'
import {Actions as FacetsActions,FacetToClassMapping} from './facets'
import * as ReduxObservable from "redux-observable";
import * as Redux from "redux";
import {GlobalState} from './'
import * as RX from "rxjs";
import "rxjs";
import {CLASSES,FACETS} from 'facetConf'

// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_STATEMENTS = "facetcheck/statements/GET_STATEMENTS" as any,
  GET_STATEMENTS_SUCCESS = "facetcheck/statements/GET_STATEMENTS_SUCCESS" as any,
  GET_STATEMENTS_FAIL = "facetcheck/statements/GET_STATEMENTS_FAIL" as any,
  MARK_FOR_FETCHING_OR_DELETION = "facetcheck/statements/MARK_FOR_FETCHING_OR_DELETION" as any,
}

export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;

export var StateRecord = Immutable.Record(
  {
    resourceDescriptions: Immutable.OrderedMap<string, Statements>(),
    fetchRequests: 0,
    fetchQueue: Immutable.OrderedMap<string,string>()
  },
  "statements"
);
export var initialState = new StateRecord();
export type StateRecordInterface = typeof initialState;

export type ResourceDescriptions = Immutable.OrderedMap<string, Statements>;

export interface Action extends GlobalActions<Actions> {
  forIri?: string;
  toRemove?:string[],
  toFetch?:FacetToClassMapping
}

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case Actions.GET_STATEMENTS:
      return state.update("fetchRequests", num => num + 1).update('fetchQueue', map => map.delete(action.forIri));;
    case Actions.GET_STATEMENTS_FAIL:
      return state.update("fetchRequests", num => num - 1);
    case Actions.GET_STATEMENTS_SUCCESS:
      return state.update("fetchRequests", num => num - 1).update("resourceDescriptions", resourceDescriptions => {
        return resourceDescriptions.set(action.forIri, Immutable.List<Statement>(action.result));
      })
    case Actions.MARK_FOR_FETCHING_OR_DELETION:
      if (action.toRemove && action.toRemove.length) {
        state =  state.update("resourceDescriptions", resourceDescriptions => {
          return resourceDescriptions.deleteAll(action.toRemove);
        });
      }
      if (action.toFetch && action.toFetch.length) {
        state = state.set('fetchQueue', Immutable.OrderedMap(action.toFetch))
      }
      return state;


    // return newState;
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
    return action$.ofType(FacetsActions.GET_MATCHING_IRIS_SUCCESS)
      .map(action => action.result)
      .map((matches:FacetToClassMapping) => {
        const matchingIris = _.keys(matches);
        const existingStatements = store.getState().statements.resourceDescriptions.keySeq().toArray();
        const toRemove = _.difference(existingStatements, matchingIris);
        const toFetch = matchingIris.filter(s => {
          return existingStatements.indexOf(s) < 0;
        }).reduce<FacetToClassMapping>(function(result, matchingIri) {
          result[matchingIri] = matches[matchingIri]
          return result;
        },{});

        return markForFetchingOrDeletion(toRemove,toFetch)
    })
  },
  //Toggle fetching of first statement (all subsequent requests are sent when the first statement if fetched)
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.MARK_FOR_FETCHING_OR_DELETION)
      .map(action => action.toFetch)
      .filter((toFetch:FacetToClassMapping) => !_.isEmpty(toFetch))
      .map((toFetch:FacetToClassMapping) => {
        const matchingIri = _.keys(toFetch)[0];
        const className = toFetch[matchingIri];
        return getStatements(matchingIri,className)
    })
  },
  //Fetch new statement from queue list when we've finished fetching
  (action$: Action$, store: Store) => {
    return action$.ofType(Actions.GET_STATEMENTS_SUCCESS)
      .map((action:any) => {
        return store.getState().statements.fetchQueue;
      })
      .filter((fetchQueue:Immutable.OrderedMap<string,string>) => fetchQueue.size > 0)
      .map((fetchQueue:Immutable.OrderedMap<string,string>) => {
        const matchingIri = fetchQueue.keySeq().first();
        const className = fetchQueue.get(matchingIri);
        return getStatements(matchingIri,className)
      })
  }
]

export function markForFetchingOrDeletion(toRemove:string[], toFetch:FacetToClassMapping):Action {
  return {
    type: Actions.MARK_FOR_FETCHING_OR_DELETION,
    toRemove,
    toFetch
  }
}
export function getStatements(resource: string, className:string): Action {
  return {
    types: [Actions.GET_STATEMENTS, Actions.GET_STATEMENTS_SUCCESS, Actions.GET_STATEMENTS_FAIL],
    promise: (client: ApiClient) =>
      client.req({
        sparqlConstruct: `${getAsString()} ${CLASSES[className].resourceDescriptionQuery(resource)}`
      }),
    forIri: resource
  };
}


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
