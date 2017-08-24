//external dependencies
import * as React from "react";
import * as getClassNames from "classnames";
import * as UriJs from "urijs";
import * as N3 from "n3";
import * as _ from "lodash";
import * as Immutable from 'immutable'
//import own dependencies
// import {getLabel,State as LabelsState,fetchLabel} from 'reducers/labels'
import { Statement } from "components";
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
  export interface GroupedStatements {
    [predicate: string]: string[];
  }

  export interface Props {
    className?: string;
    // labels: LabelsState,
    forIri: string;
    statements: Immutable.List<N3.Statement>;
    // fetchLabel: typeof fetchLabel
  }
}

class ResourceDescription extends React.PureComponent<ResourceDescription.Props, any> {
  groupStatementsByPred(): ResourceDescription.GroupedStatements {
    return this.props.statements.reduce<ResourceDescription.GroupedStatements>((result, statement) => {
      if (this.props.forIri !== statement.subject) return result;
      if (!result[statement.predicate]) result[statement.predicate] = [];
      result[statement.predicate].push(statement.object);
      return result;
    }, {})
  }
  renderStatements() {
    const grouped = this.groupStatementsByPred();
    const rows: any[] = [];

    for (var pred in grouped) {
      rows.push(
        <Statement
          key={pred}
          // labels={this.props.labels}
          predicate={pred}
          objects={grouped[pred]}
          context={this.props.statements}
        />
      );
    }
    return rows;
  }
  downloadLd(format: string, extension: string) {
    var writer = N3.Writer({ format: format });
    this.props.statements.forEach(statement => {
      writer.addTriple(statement);
    });
    // writer.end((error:any, result:string) => { downloadData(result, getLabel(this.props.labels,this.props.forIri, this.props.fetchLabel) + extension) });
    writer.end((error: any, result: string) => {
      downloadData(
        result,
        // getLabel(this.props.labels,this.props.forIri) + extension)
        "download"
      );
    });
  }
  render() {
    const {
      statements,
      forIri,
      className
      // labels,fetchLabel
    } = this.props;
    var style = {
      [styles.resourceDescription]: styles.resourceDescription,
      whiteSink: true,
      [className]: !!className
    };
    // const {meta:{pristine}, input:{value}} = this.props;
    return (
      <div className={getClassNames(style)}>
        <div className={styles.header}>
          <div />
          {/* use this, so the 'space-between css prop places the iri in the middle'*/}
          <div className={styles.iri}>
            <a href={forIri} target="_blank">
              {
                // getLabel(labels,forIri)
                forIri
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
