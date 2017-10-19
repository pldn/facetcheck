//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import {extname} from 'path'
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions } from "reducers";
import { default as prefixes, getAsString } from "prefixes";
const urlParse = require("url-parse");
import {default as Tree} from "helpers/Tree";
import { Term, Statement, Statements} from '@triply/triply-node-utils/build/src/nTriply'
import { Actions as FacetsActions, Action as FacetAction } from "./facets";
import * as ReduxObservable from "redux-observable";
import * as Redux from "redux";
import { GlobalState } from "./";
import * as RX from "rxjs";
import "rxjs";
import { CLASSES, FACETS } from "facetConf";

// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_STATEMENTS = "facetcheck/statements/GET_STATEMENTS" as any,
  GET_STATEMENTS_SUCCESS = "facetcheck/statements/GET_STATEMENTS_SUCCESS" as any,
  GET_STATEMENTS_FAIL = "facetcheck/statements/GET_STATEMENTS_FAIL" as any,
  MARK_FOR_FETCHING_OR_DELETION = "facetcheck/statements/MARK_FOR_FETCHING_OR_DELETION" as any
}



export var StateRecord = Immutable.Record(
  {
    resourceDescriptions: Immutable.OrderedMap<string, Statements>(),
    fetchRequests: 0,
    fetchQueue: Immutable.OrderedSet<string>(),
    getMatchingIrisError: <string>null,
    errors: Immutable.OrderedMap<string, string>()
  },
  "statements"
);
export var initialState = new StateRecord();
export type StateRecordInterface = typeof initialState;

export type ResourceDescriptions = Immutable.OrderedMap<string, Statements>;
export type Errors = Immutable.OrderedMap<string, string>;

export interface Action extends GlobalActions<Actions> {
  forIri?: string;
  toRemove?: string[];
  toFetch?: string[];
}

export function reducer(state = initialState, action: Action & FacetAction) {
  switch (action.type) {
    case FacetsActions.GET_MATCHING_IRIS_FAIL:
      return state.set("getMatchingIrisError", action.error);
    case Actions.GET_STATEMENTS:
      return state.update("fetchRequests", num => num + 1).update("fetchQueue", map => map.delete(action.forIri));
    case Actions.GET_STATEMENTS_FAIL:
      return state
        .update("fetchRequests", num => num - 1)
        .update("errors", errors => errors.set(action.forIri, action.message));
    case Actions.GET_STATEMENTS_SUCCESS:
      return state.update("fetchRequests", num => num - 1).update("resourceDescriptions", resourceDescriptions => {
        return resourceDescriptions.set(action.forIri, action.result);
      });
    case Actions.MARK_FOR_FETCHING_OR_DELETION:
      if (action.toRemove && action.toRemove.length) {
        state = state.update("resourceDescriptions", resourceDescriptions => {
          return resourceDescriptions.deleteAll(action.toRemove);
        });
      }
      if (action.toFetch && action.toFetch.length) {
        state = state.set("fetchQueue", Immutable.OrderedSet(action.toFetch));
      }
      return state;
    // case FacetsActions.REFRESH_FACETS:
    //   return state.set('resourceDescriptions', Immutable.OrderedMap<string, Statements>())

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
    return action$
      .ofType(FacetsActions.GET_MATCHING_IRIS_SUCCESS)
      .map((action: FacetAction) => action.result)
      .map(result => {
        const matchingIris = result.iris;
        const existingStatements = store
          .getState()
          .statements.resourceDescriptions.keySeq()
          .toArray();
        const toRemove = _.difference(existingStatements, matchingIris);
        const toFetch = matchingIris.filter(s => {
          return existingStatements.indexOf(s) < 0;
        });

        return markForFetchingOrDeletion(toRemove, toFetch);
      });
  },
  //Toggle fetching of first statement (all subsequent requests are sent when the first statement if fetched)
  (action$: Action$, store: Store) => {
    return action$
      .ofType(Actions.MARK_FOR_FETCHING_OR_DELETION)
      .map(action => action.toFetch)
      .filter((toFetch: string[]) => toFetch.length > 0)
      .map((toFetch: string[]) => {
        const matchingIri = toFetch[0];
        return getStatements(matchingIri, store.getState().facets.selectedClass);
      });
  },
  //Fetch new statement from queue list when we've finished fetching
  (action$: Action$, store: Store) => {
    return action$
      .ofType(Actions.GET_STATEMENTS_SUCCESS)
      .map((action: any): any => {
        return store.getState().statements.fetchQueue;
      })
      .filter((fetchQueue: Immutable.OrderedSet<string>) => fetchQueue.size > 0)
      .map((fetchQueue: Immutable.OrderedSet<string>) => {
        const matchingIri = fetchQueue.first();
        return getStatements(matchingIri, store.getState().facets.selectedClass);
      });
  }
];

export function markForFetchingOrDeletion(toRemove: string[], toFetch: string[]): Action {
  return {
    type: Actions.MARK_FOR_FETCHING_OR_DELETION,
    toRemove,
    toFetch
  };
}
export function getStatements(resource: string, className: string): Action {
  if (!className) throw new Error("missing classname. cannot get statements");
  if (!resource) throw new Error("missing resource IRI. cannot get statements");
  const q = `${getAsString()} ${CLASSES[className].resourceDescriptionQuery(resource)}`;
  console.groupCollapsed("Querying for resource description of " + resource);
  console.info(q);
  console.groupEnd();
  return {
    types: [Actions.GET_STATEMENTS, Actions.GET_STATEMENTS_SUCCESS, Actions.GET_STATEMENTS_FAIL],
    promise: (client: ApiClient) =>
      client.req({
        sparqlConstruct: q
      }),
    forIri: resource
  };
}

// export function
export function getLabel(iri: string, tree: Tree): string {
  if (!N3.Util.isIRI(iri)) return null;
  const labelStatement = tree
    .getStatements()
    .find(s => s[1].value === "http://www.w3.org/2000/01/rdf-schema#label" && s[0].value === iri);
  if (labelStatement && labelStatement[2].termType === 'literal') return labelStatement[2].value
  const lnameInfo = getLocalNameInfo(iri);
  if (lnameInfo.localName) {
    return lnameInfo.localName;
  }
  return null;
}

export function getStatementsAsTree(forIri: Term, statements: Statements) {
  return Tree.fromStatements(forIri, statements);
}

export interface RenderConfiguration {
  type?: "textarea" | "image";
  size?: "dynamic" | "full";
  hideOnLoad?: boolean;
  asToggle?: boolean;
}
export interface WidgetConfig {
  label?: string;
  config?: RenderConfiguration;
  values?: Tree[]; //a node in the tree,
  children?: WidgetConfig[];
  key?: string;
}
export type SelectWidget = (tree: Tree) => WidgetConfig;

/**
 * Render selectors
 */
const selectGeometry: SelectWidget = t => {
  const node = t
    .find([prefixes.geo + "hasGeometry", null, prefixes.geo + "asWKT"])
    .limit(1)
    .exec();
  if (node.length) {
    return <WidgetConfig>{
      // value: node[0]
      values: node
    };
  }
};
const selectDescription: SelectWidget = t => {
  const node = t
    .find([prefixes.dcterms + "description", null])
    .limit(1)
    .exec();
  if (node.length) {
    return <WidgetConfig>{
      values: node,
      config: {
        type: "textarea"
      }
    };
  }
};
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".bmp", ".tiff"];
export const selectImage: SelectWidget = t => {
  const patterns = [
    [prefixes.foaf + "depiction", null],
    [null, { datatype: "https://triply.cc/triply/def/imageURI" }],
    [
      null,
      {
        datatype: "http://www.w3.org/2001/XMLSchema#anyURI",
        validationFunction: (term: Term) => imageExtensions.indexOf(extname(term.value).toLowerCase()) >= 0
      }
    ]
  ];
  for (var i = 0; i < patterns.length; i++) {
    const nodes = t.find(patterns[i]).limit(1).exec();
    if (nodes.length) {
      return {
        values: nodes,
        type: "image",
        allowDuplicates: i === 0
      };
    }
  }
};
const selectLabel: SelectWidget = t => {
  const node = t
    .find([prefixes.rdfs + "label", null])
    .limit(1)
    .exec();
  if (node.length) {
    return <WidgetConfig>{
      // value: node[0]
      values: node
    };
  }
};
const catchAll: SelectWidget = t => {
  var nodes = t
    .find()
    .depth(1)
    .exec();
  const removeNodes: number[] = [];
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.getTerm().termType === 'bnode') {
      removeNodes.push(i);
      if (node.hasChildren()) {
        nodes = nodes.concat(node.getChildren());
      }
    }
  }
  _.pullAt(nodes, removeNodes);
  const groupedByPred = _.groupBy(
    nodes,
    n =>
      n.getPredicate() +
      n
        .getParents()
        .map(p => p.getPredicate())
        .join(",")
  );
  const selections: WidgetConfig[] = [];
  _.forEach(groupedByPred, (nodes, predicate) => {
    selections.push({
      label: getLabel(nodes[0].getPredicate(), t),
      values: nodes
    });
  });
  if (selections.length) {
    return <WidgetConfig>{
      children: selections,
      label: "Properties",
      config: {
        asToggle: true,
        hideOnLoad: true,
        size: "dynamic"
      }
    };
  }
};
export var SelectWidgets: SelectWidget[] = [
  // renderLabel,
  selectDescription,
  selectGeometry,
  catchAll
];

const getWidgetKey = (widget: WidgetConfig): string => {
  if (widget.values) return widget.values.map(value => value.getKey()).join();
  if (widget.children) return widget.children.map(s => getWidgetKey(s)).join();
  return "";
};

export function getWidgets(tree: Tree, selectWidgets: SelectWidget[] = SelectWidgets): WidgetConfig {
  const selectedTreeNodes = new Set<Tree>();

  const postprocessWidget = (widget: WidgetConfig): WidgetConfig => {
    widget.key = getWidgetKey(widget);
    if (!widget.config) widget.config = {};
    if (widget.children) {
      //make sure child widgets have a key as well
      widget.children = widget.children.map(child => postprocessWidget(child));
    }
    //make sure we don't render values twice...
    //so, keep track of a set of values that we're already rendering
    //if we come accross a widget that has one of those values, just remove that value
    if (widget.values) {
      const removeIndexes: number[] = [];
      for (var i = 0; i < widget.values.length; i++) {
        const val = widget.values[i];
        if (selectedTreeNodes.has(val)) {
          removeIndexes.push(i);
        } else {
          selectedTreeNodes.add(val);
        }
      }
      _.pullAt(widget.values, removeIndexes);
    }
    return widget;
  };

  var widgets: WidgetConfig[] = [];
  for (const selectWidget of selectWidgets) {
    const widget = selectWidget(tree);
    if (widget) {
      widgets = widgets.concat(postprocessWidget(widget));
    }
  }

  return {
    children: widgets,
    config: {}
  };
}
/**
 * borrowed from triply-node-utils
 */
function getLocalNameInfo(iri: string): { iri: string; localName?: string } {
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
    const localName: string = parsed.pathname.substr(i + 1) + parsed.query + parsed.hash;
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
