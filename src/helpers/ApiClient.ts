//external dependencies
import * as superagent from 'superagent';
import {Request} from 'express';
import * as _ from 'lodash';
import SparqlJson from './SparqlJson'
import * as N3 from 'n3';
//import own dependencies
import {IGlobalState} from 'redux/modules'
import {getConfig, Config} from 'staticConfig';

// const config = getConfig();
// declare var __SERVER__: boolean;
// const methods = ['get', 'post', 'put', 'patch', 'del'];


export interface RequestArguments {
  method?: 'get' | 'post' | 'delete' | 'put' | 'patch',
  endpoint?: string,
  headers?:{[key:string]:string}
  sparqlSelect?: string,
  graph?: string,
  sparqlConstruct?: string,
  query?: Object,
  isForm?:boolean
  body?: Object,
  statusCodeMap?:{[fromCode: number]: number}//these status codes are set to 200 (OK).Useful if we expect e.g. a 404, but don't want to clobber the browser with errors
  files? : {[name:string]: string|File}
}

export default class ApiClient {
  private request: Request;
  private config: Config
  constructor(state:IGlobalState, req?:Request) {
    if (state && state.config && state.config.config) {
      this.config = state.config.config;
    } else {
      //just get state from module directly.
      //Would like to avoid this when the class is ran from the client,
      //because the client would not know about env variable overwrites
      this.config = getConfig();
    }

    this.request = req;
  }



  public req<A extends RequestArguments>(args:A) {
    return new Promise((resolve, reject) => {
      //set params based on sparql-specific settings
      if (args.sparqlSelect || args.sparqlConstruct) {
        args.method = 'post';
        args.isForm = true;
        args.body = {
          query: args.sparqlSelect || args.sparqlConstruct
        }
        if (!args.headers) args.headers = {};
        args.headers['Accept'] = args.sparqlSelect?'application/sparql-results+json':'application/n-triples'
        if (args.graph) {
          args.body['default-graph-uri'] = args.graph
        }
      }
      const request:superagent.Request<any> = superagent[args.method](args.endpoint || this.config.endpoint);
      if (args.headers) {
        for (var h in  args.headers) {
          request.set(h, args.headers[h])
        }
      }

      if (args.isForm) request.type('form')
      if (args.query) {
        request.query(args.query);
      }
      if (args.files) {
        _.forEach(args.files, function(val, key) {
          request.attach(key, <any>val);
        })
      }
      if (args.body) {
        request.send(args.body);
      }
      if (args.statusCodeMap) {
        request.set('x-statusMap',_.map(args.statusCodeMap, function(val:string, key:string) {
          return key + ':' + val;
          }).join(','))
      }
      const formatError = (err:any, body:any) => {
        if (!_.isEmpty(body)) return body;
        if (err.message && err.status) return {error: err.status + ': ' + err.message, message: err.message, status: err.status}
        return err;
      }
      if (__SERVER__ && request.buffer) request.buffer(true)//need this somehow for request from server to work. on clientside it's the other way around
      request.end((err:any, res: any) => {
        const body = (res? res.body:undefined);
        if (err || !res) return reject(formatError(err, body));
        try {
          if (args.sparqlSelect) return resolve(new SparqlJson(body));
          if (args.sparqlConstruct) {
            const parser = N3.Parser({ format: 'text/turtle' });
            const statements:N3.Statement[] = [];
            if (res.text === undefined) {
              return reject({message: 'No construct result to parse'})
            }
            parser.parse(res.text, function(e, statement) {
              if (e) {
                return reject({message: e.message})
              }
              if (!statement) {
                return resolve(statements);
              }
              statements.push(statement)
            })
          } else {
            resolve(body);
          }

        } catch(e) {
          reject(e);
        }
      });
    })
  }

}
