//external dependencies
import * as superagent from "superagent";
import { Request } from "express";
import * as _ from "lodash";
import * as N3 from 'n3'
//import own dependencies
import { GlobalState } from "reducers";
import { getConfig, Config, ConnectionConfig } from "staticConfig";
import SparqlJson from './SparqlJson'
import * as parseLinkHeader from "parse-link-header";
const urlParse = require("url-parse");

// const config = getConfig();
// declare var __SERVER__: boolean;
// const methods = ['get', 'post', 'put', 'patch', 'del'];
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
export function reformatUrlForClient(clientConnection: ConnectionConfig, url: string): string {
  const parsed = urlParse(url);
  parsed.set("pathname", "/_api" + parsed.pathname);
  parsed.set("hostname", clientConnection.domain);
  if (clientConnection.publicPort !== 80) parsed.set("port", clientConnection.publicPort);
  parsed.set("protocol", clientConnection.ssl ? "https:" : "http:");
  return parsed.toString();
}
export default class ApiClient {
  private static requests: RunningRequests = {};
  private request: Request;
  private config: Config;
  constructor(state: GlobalState, req?: Request) {
    if (state && state.config && state.config.staticConfig) {
      this.config = state.config.staticConfig;
    } else {
      //just get state from module directly.
      //Would like to avoid this when the class is ran from the client,
      //because the client would not know about env variable overwrites
      this.config = getConfig();
    }

    this.request = req;
  }

  formatUrl(urlOrPath: string) {
    if (!urlOrPath) return "";
    if (urlOrPath.indexOf("http") === 0) {
      //its a complete url, and not only a path. (probably intentional, so leave this)
      return urlOrPath;
    }
    const adjustedPath = urlOrPath[0] !== "/" ? "/" + urlOrPath : urlOrPath;
    if (__SERVER__) {
      // Prepend host and port of the API server to the path.
      return (
        (this.config.serverConnection.ssl ? "https" : "http") +
        "://" +
        this.config.serverConnection.domain +
        (this.config.serverConnection.ssl ? "" : ":" + this.config.serverConnection.publicPort) +
        adjustedPath
      );
    }
    return "/_api" + adjustedPath;
  }

  //Modify urls gotten from server, so they are send via our proxy (needed because of cookie stuff...)
  reformatUrlForClient(url: string): string {
    return reformatUrlForClient(this.config.clientConnection, url);
  }

  formatLinkHeader(linkHeader: string) {
    if (!linkHeader) return {};
    const links = parseLinkHeader(linkHeader);
    _.forEach(links, (val, key) => {
      links[key].url = this.reformatUrlForClient(val.url);
    });
    return links;
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
      var requestTo = args.apiUrl ? this.reformatUrlForClient(args.apiUrl) : this.formatUrl(args.url);
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
        if (args.endpoint) {
          requestTo = args.endpoint;
        } else if (this.config.sparqlEndpoint) {
          requestTo = this.config.sparqlEndpoint.url;
          if (this.config.sparqlEndpoint.token) {
            args.headers["Authorization"] = "Bearer " + this.config.sparqlEndpoint.token
          }
        }
      }

      const request: superagent.Request<any> = superagent[args.method](requestTo);
      const uuid = this.addRequestReference(args.requestTag, request);
      console.info(requestTo);
      if (args.query) {
        request.query(args.query);
      }
      if (args.headers) {
        for (var h in args.headers) {

          request.set(h, args.headers[h]);
        }
      }
      if (args.isForm) request.type("form");
      if (__SERVER__) {
        //always behind a proxy anyway, so proxy these headers
        ["cookie", "x-forwarded-for", "x-real-ip", "x-forwarded-proto"].forEach(key => {
          if (this.request.get(key)) request.set(key, this.request.get(key));
        });
      }
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
        if (err.status) returnErr.error = err.status + ": " + (body.message || err.message);
        if (!returnErr.message) returnErr.message = err.message;
        if (!returnErr.status) returnErr.status = err.status;
        if (returnErr.serverError) returnErr.devError = returnErr.serverError;
        if (!_.isEmpty(returnErr.message)) return returnErr;
        return err;
      };
      const getBody = (res: superagent.Response) => {
        if (res.body) return res.body;
        if (res.text) {
          if (args.sparqlConstruct) {
            return  N3.Parser().parse(res.text)
          }
          return res.text
        }
        return undefined
      }
      request.end((err: Error, res: superagent.Response) => {
        this.removeRequestReference(args.requestTag, uuid);
        const body = getBody(res);

        if (err || !res) return reject(formatError(err, body));
        if (args.sparqlSelect) {
          return resolve(<any>new SparqlJson(body))
        }
        const meta = {
          status: res.status,
          header: res.header,
          links: this.formatLinkHeader(res.header.link),
          req: request
        };

        return resolve(
          <any>{
            body,
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
