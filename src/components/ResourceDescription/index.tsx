//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
// import * as UriJs from "urijs";
import * as N3 from "n3";
import * as Immutable from 'immutable'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { Statements } from "components";
import {getPaths,Paths,groupPaths, getLabel} from 'reducers/statements'
var downloadData = (function() {
  if (__SERVER__) return;
  var a: any = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function(data: any, fileName: string) {
    var blob = new Blob([data], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

const styles = require("./style.scss");
namespace ResourceDescription {

  export interface StatementContext {
    path: N3.Statement[],
    value: string
  }
  export interface GroupedStatements {
    [fingerPrint: string]: StatementContext[];
  }
  // statementContext: Statement[
  // <sub> geo:hasGemeometry _bnode .
  // _bnode geo:asWkt "wktString"
  // ],
  // value: "wktString"
  // resourceContext: Statement[]
  //
  //
  //
  export interface Props {
    className?: string;
    forIri: string;
    statements: Immutable.List<N3.Statement>;
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {



  groupPathsBySignature(paths:Paths) {

  }

  // groupStatementsByPred(): ResourceDescription.GroupedStatements {
  //   return this.props.statements.reduce<ResourceDescription.GroupedStatements>((result, statement) => {
  //     if (this.props.forIri !== statement.subject) return result;
  //     if (!result[statement.predicate]) result[statement.predicate] = [];
  //     result[statement.predicate].push(statement.object);
  //     return result;
  //   }, {})
  // }
  renderStatements() {
    const groupedPaths = groupPaths(getPaths(this.props.statements.toArray(), this.props.forIri));
    const rows: any[] = [];

    for (var groupKey  in groupedPaths) {
      rows.push(
        <Statements
          key={groupKey}
          paths={groupedPaths[groupKey]}
          resourceContext={this.props.statements}
        />
      );
    }
    return <div className={styles.statements}>{rows}</div>;
  }
  downloadLd(format: string, extension: string) {
    var writer = N3.Writer({ format: format });
    this.props.statements.forEach(statement => {
      writer.addTriple(statement);
    });
    writer.end((error: any, result: string) => {
      downloadData(
        result,
        "download"
      );
    });
  }
  render() {
    const {
      forIri,
      className,
      statements,
      // labels,fetchLabel
    } = this.props;
    const label = getLabel(forIri,statements)
    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className
    };
    return (
      <div className={getClassNames(style)}>
        <div className={styles.header}>
          <div />
          {/* use this, so the 'space-between css prop places the iri in the middle'*/}
          <div className={styles.iri}>
            <a href={forIri} target="_blank">
              {
                label || forIri
              }
            </a>
          </div>
          <div className={styles.controls}>
            <a
              href="javascript:void(0)"
              onClick={() => {
                this.downloadLd("text/turtle", ".ttl");
              }}
            >
              .ttl
            </a>
            <a
              href="javascript:void(0)"
              onClick={() => {
                this.downloadLd("N-Triples", ".nt");
              }}
            >
              .nt
            </a>
            <a
              href="javascript:void(0)"
              onClick={() => {
                this.downloadLd("N3", ".n3");
              }}
            >
              .n3
            </a>
          </div>
        </div>
        {this.renderStatements()}
      </div>
    );
  }
}

export default ResourceDescription;
