//external dependencies
import * as superagent from "superagent";
import * as _ from "lodash";
import * as N3 from 'n3'
import * as NTriply from '@triply/triply-node-utils/build/src/nTriply'
//import own dependencies
import {CONFIG} from '../facetConf'
import SparqlJson from './SparqlJson'
import * as parseLinkHeader from "parse-link-header";

// const config = getConfig();
// declare var __SERVER__: boolean;
// const methods = ['get', 'post', 'put', 'patch', 'del'];
type Query  = {[key:string]:string}
const getQueryArgs = ():Query => {
  if (!window || !window.location || !window.location.search) {
    return { };
  }
  const query = window.location.search

  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce<Query>((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { });
}
export interface Links extends parseLinkHeader.Links {
  next: parseLinkHeader.Link;
  first: parseLinkHeader.Link;
}
export interface ResponseMetaData {
  status: number;
  links: Links;
  header: { [key: string]: string };
}
export interface ClientResult {
  body: any;
  meta?: ResponseMetaData;
}
export interface RequestArguments {
  url?: string;
  apiUrl?: string;
  method?: "get" | "post" | "delete" | "put" | "patch";
  query?: Object;
  body?: any;
  contentType?: string;
  statusCodeMap?: { [fromCode: number]: number }; //these status codes are set to 200 (OK).Useful if we expect e.g. a 404, but don't want to clobber the browser with errors
  files?: { [fieldName: string]: string | File };
  onProgress?: Function;
  requestTag?: string; //when we're passing this arg, we're saving the request globally so reducers can e.g. cancel it

  //sparql-specific stuff
  endpoint?: string;
  headers?: { [key: string]: string };
  sparqlSelect?: string;
  graph?: string;
  sparqlConstruct?: string;
  isForm?: boolean;
}
interface RunningRequests {
  [reqTag: string]: { [uuid: string]: superagent.Request<any> };
}

export default class ApiClient {
  private static requests: RunningRequests = {};
  // private request: Request;


  formatUrl(urlOrPath: string) {
    if (!urlOrPath) return "";
    if (urlOrPath.indexOf("http") === 0) {
      //its a complete url, and not only a path. (probably intentional, so leave this)
      return urlOrPath;
    }
    const adjustedPath = urlOrPath[0] !== "/" ? "/" + urlOrPath : urlOrPath;
    return "/_api" + adjustedPath;
  }

  private addRequestReference(tag: string, request: superagent.Request<any>) {
    if (tag) {
      if (!ApiClient.requests[tag]) ApiClient.requests[tag] = {};
      const uuid = _.uniqueId();

      ApiClient.requests[tag][uuid] = request;
      return uuid;
    }
  }
  private removeRequestReference(tag: string, uuid: string) {
    if (tag && uuid) {
      if (!ApiClient.requests[tag]) return;
      delete ApiClient.requests[tag][uuid];
      if (_.isEmpty(ApiClient.requests[tag])) delete ApiClient.requests[tag];
    }
  }

  public req<A extends RequestArguments, R extends Object>(args: A) {
    return new Promise<R>((resolve, reject) => {
      var requestTo = this.formatUrl(args.url);
      //set params based on sparql-specific settings
      if (args.sparqlSelect || args.sparqlConstruct) {
        args.method = "post";
        args.isForm = true;
        args.body = {
          query: args.sparqlSelect || args.sparqlConstruct
        };
        if (!args.headers) args.headers = {};
        args.headers["Accept"] = args.sparqlSelect ? "application/sparql-results+json" : "text/turtle";
        if (args.graph) {
          args.body["default-graph-uri"] = args.graph;
        }
        const query = getQueryArgs();
        if (query.endpoint) {
          requestTo = query.endpoint
        } else if (args.endpoint) {
          requestTo = args.endpoint;
        } else {
          requestTo = CONFIG.endpoint.url
          if (CONFIG.endpoint.token) {
            args.headers["Authorization"] = "Bearer " + CONFIG.endpoint.token
          }
        }
      }

      const request: superagent.Request<any> = superagent[args.method](requestTo);
      const uuid = this.addRequestReference(args.requestTag, request);
      // console.info(requestTo);
      if (args.query) {
        request.query(args.query);
      }
      if (args.headers) {
        for (var h in args.headers) {

          request.set(h, args.headers[h]);
        }
      }
      if (args.isForm) request.type("form");

      if (args.contentType) {
        request.set("Content-Type", args.contentType);
      }
      if (args.files) {
        _.forEach(args.files, function(val, key) {
          request.attach(key, <any>val);
        });
      }
      if (args.onProgress) {
        request.on("progress", args.onProgress);
      }
      if (args.body) {
        request.send(args.body);
      }
      if (args.statusCodeMap) {
        request.set(
          "x-statusMap",
          _.map(args.statusCodeMap, function(val: string, key: string) {
            return key + ":" + val;
          }).join(",")
        );
      }
      const formatError = (err: any, body: any) => {
        var returnErr = typeof body === "object" ? body : {};
        if (typeof body === "string") {
          returnErr.message = body;
        }
        if (err.status) returnErr.error = err.status + ": " + err.message;
        if (!returnErr.message) returnErr.message = err.message;
        if (!returnErr.status) returnErr.status = err.status;
        if (returnErr.serverError) returnErr.devError = returnErr.serverError;
        if (!_.isEmpty(returnErr.message)) return returnErr;
        return err;
      };

      request.end((err: Error, res: superagent.Response) => {
        const getBody = (res: superagent.Response) => {
          if (!res) return undefined
          if (res.body) return res.body;
          if (res.text) {
            return res.text
          }
          return undefined
        }
        this.removeRequestReference(args.requestTag, uuid);

        const body = getBody(res);
        if (err || !res) return reject(formatError(err, body));
        if (args.sparqlSelect) {
          return resolve(<any>new SparqlJson(body))
        }
        const meta = {
          status: res.status,
          header: res.header,
          req: request
        };

        return resolve(
          <any>{
            body:(args.sparqlConstruct? N3.Parser().parse(body).map(s => NTriply.n3ToNtriply(s)): body),
            meta
          }
        );
      });
    });
  }
  public static abortRequestsByTag(tag: string) {
    if (ApiClient.requests[tag]) {
      _.forEach(ApiClient.requests[tag], val => {
        val.abort();
      });
    }
  }
}
