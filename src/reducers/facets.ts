//external dependencies
import * as _ from "lodash";
import * as N3 from "n3";
import * as Immutable from "immutable";
import ApiClient from "helpers/ApiClient";
import { GlobalActions, GlobalState } from "reducers";
import {default as prefixes, getAsString, prefix} from 'prefixes'
import SparqlBuilder from 'helpers/SparqlBuilder'
import * as sparqljs from 'sparqljs'
import SparqlJson from 'helpers/SparqlJson'
// import {Actions as FacetActions} from './facets'
//import own dependencies
export enum Actions {
  GET_MATCHING_IRIS = "facetcheck/facets/GET_MATCHING_IRIS" as any,
  GET_MATCHING_IRIS_SUCCESS = "facetcheck/facets/GET_MATCHING_IRIS_SUCCESS" as any,
  GET_MATCHING_IRIS_FAIL = "facetcheck/facets/GET_MATCHING_IRIS_FAIL" as any,
  TOGGLE_CLASS = "facetcheck/facets/TOGGLE_CLASS" as any,
  // GET_FACET_CONFIG = "facetcheck/facets/GET_FACET_CONFIG" as any,
  // GET_FACET_CONFIG_SUCCESS = "facetcheck/facets/GET_FACET_CONFIG_SUCCESS" as any,
  // GET_FACET_CONFIG_FAIL = "facetcheck/facets/GET_FACET_CONFIG_FAIL" as any
}

export type Statement = N3.Statement;
export type Statements = Immutable.List<Statement>;



//
// export type FacetConfig = [
//   {
//     classConfig: FacetClassConfig,
//     facets: FacetPropertyConfig[]
//   }
// ]
//
// export interface FacetPropertyConfig {
//
// }
// export interface FacetClassConfig {
//   iri:string,
//   label: string,
//   selected: boolean
// }
//
// export var facetConfig:FacetConfig = [
//   {
//     classConfig: {
//       iri: 'https://cultureelerfgoed.nl/vocab/Monument',
//       label: 'Monument',
//       selected: true
//     },
//     facets: [
//       {
//         property: 'bla',
//
//       }
//     ]
//   }
// ]


export interface ClassProps {
  default:boolean,
  iri:string,
  label:string,
  facets:string[]
}
export var CLASSES:{[className:string]: ClassProps} = {
  'https://cultureelerfgoed.nl/vocab/Monument': {
    default: true,//default
    iri: 'https://cultureelerfgoed.nl/vocab/Monument',
    label: 'Monument',
    facets: ['https://cultureelerfgoed.nl/vocab/province']
  }
}
export type FacetTypes = 'multiselect' | 'slider' | 'multiselectText'
export interface FacetProps {
  iri:string,
  label:string,
  datatype: string,
  facetType: FacetTypes,
  getBgp: (values:string[]) => string
}
export var FACETS:{[property:string] : FacetProps} = {
  'https://cultureelerfgoed.nl/vocab/province': {
    iri: 'https://cultureelerfgoed.nl/vocab/province',
    label: 'Provincie',
    datatype: <string>null,
    facetType: 'multiselect',
    getBgp: (values:string[]) => {
      return ''
    }
  }
}




export interface FacetPropertyConfigProps {
  iri: string
  label: string
  datatype: string
  type: FacetTypes
}
export var FacetPropertyConfig = Immutable.Record<FacetPropertyConfigProps>(
  {
    iri: null,
    label:null,
    datatype: null,
    type:null,
  },
  "facetPropertyConfig"
)

export interface FacetConfigProps {
  iri: string,
  minValue: any,
  maxValue:any,
  values:any
}
export var FacetConfig = Immutable.Record<FacetConfigProps>(
  {
    iri: null,
    minValue: null,
    maxValue:null,
    values:null
  },
  "facetConfig"
)
export type FacetsConfig = Immutable.OrderedMap<string, Immutable.Record.Inst<Partial<FacetConfigProps>>>
export type SelectedClasses = Immutable.OrderedMap<string, boolean>
export type FacetsProps = Immutable.OrderedMap<string,Immutable.Record.Inst<FacetConfigProps>>
export var StateRecord = Immutable.Record(
  {
    matchingIris: Immutable.List<string>(),
    fetchResources: 0,
    selectedClasses: <SelectedClasses>Immutable.OrderedMap<string, boolean>().withMutations(m => {
      //populate selectedClasses (taken from object here, so no guarantees on sorting)
      for (const c of Object.keys(CLASSES)) {
        m.set(c, CLASSES[c].default)
      }
      return m
    }),
    facetProps: <FacetsProps>Immutable.OrderedMap<string,Immutable.Record.Inst<FacetConfigProps>>()
  },
  "facets"
);
export var initialState = new StateRecord();


export type StateRecordInterface = typeof initialState;

export interface Action extends GlobalActions<Actions> {
  checked?: boolean,
  className?: string
}


export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case Actions.GET_MATCHING_IRIS:
      return state.update("fetchResources", num => num + 1);
    case Actions.GET_MATCHING_IRIS_FAIL:
      return state.update("fetchResources", num => num - 1);
    case Actions.GET_MATCHING_IRIS_SUCCESS:
      return state.update("fetchResources", num => num - 1).set("matchingIris", Immutable.List(action.result))
    case Actions.TOGGLE_CLASS:
      return state.setIn(<[keyof StateRecordInterface, string]>['selectedClasses', action.className], action.checked)
    default:
      return state;
  }
}


export function facetsToQuery(state:GlobalState) {


  const sparqlBuilder = SparqlBuilder.get(prefixes);
  sparqlBuilder.vars('?_r')
  sparqlBuilder.limit(20)

  /**
   * Add classes
   */
   const unions:sparqljs.QueryPattern[] = [];
   for (const [className, selected] of state.facets.selectedClasses) {
     if (selected) unions.push({type: 'bgp', triples: [{
       subject: '?_r',
       predicate: prefix('rdf', 'type'),
       object: className
     }]})
   }
   sparqlBuilder.addUnions(unions)

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

export function toggleClass (className:string, checked:boolean):Action {
  return {
    type: Actions.TOGGLE_CLASS,
    className: className,
    checked: checked
  };
};

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
