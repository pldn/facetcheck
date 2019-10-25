import { Quad, DataFactory } from "n3";
import Tree from './Tree';
import { getLabel, getWidgets } from "../reducers/statements";
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';
import {deburr, kebabCase} from 'lodash';

function getValue(node: Tree, tree: Tree) {
  const term = node.getTerm();
  if (term.termType === 'NamedNode') return getLabel(term, tree);
  return term.value;
}

function createDownloadFilename(downloadFilenameBase:string) {
  if (!downloadFilenameBase) return "facetcheck.csv";
  // deburr: e.g. Å -> A, è -> e
  // kebabCase: e.g. "makeMe a KEBAB" -> make-me-a-kebab
  // regex replace: remove non-alphanumeric non-dash chars, e.g. 😋 -> ''
  return `${kebabCase(deburr(downloadFilenameBase).replace(/[^a-z0-9\-\s]/gi, '').trim())}.csv`;
}

interface Row { [key: string]: string }

export function downloadCsv(descriptions: Array<[string, Array<Quad>]>, downloadFilenameBase: string) {

  const rows: Row[] = [];

  // Keep track of the properties we encounter.
  // Distinguish normal properties from 'special' ones (leaflet, image source)
  // (we need this later for specifying the order or columns)
  const normalHeaderNames: Set<string> = new Set();
  const specialHeaderNames: Set<string> = new Set();

  for (const d of descriptions) {

    // Get the resource and create a Tree and WidgetConfig for it.
    const resource = DataFactory.namedNode(d[0]);
    const tree = Tree.fromStatements(resource, d[1]);
    const widgets = getWidgets(tree);

    // Initialize a row for the csv, and create a cell for the resource iri.
    const row: Row = { resource: getLabel(resource, tree) }

    // The list of normal properties can be identified by its' "Properties" label.
    const normalProperties = widgets.children.filter(c => c.label === "Properties")[0].children;

    // Create a cell in the row for each property.
    // We use the first of its' objects as value.
    for (const child of normalProperties) {
      if (child.values && child.values.length) {
        row[child.label] = getValue(child.values[0], tree);
        normalHeaderNames.add(child.label);
      }
    }

    // Special properties are all the property lists that don't have the "Properties" label.
    const specialProperties = widgets.children.filter(c => c.label !== "Properties");

    // Create cells for each kind of the special properties.
    // We only use one of each kind, consistently with the web interface.
    for (const specialProperty of specialProperties) {
      let objectTree:Tree;
      if (specialProperty.values){
        // there's only one widget
        objectTree = specialProperty.values[0];
      } else if (specialProperty.children) {
	// there's multiple widgets of this kind, choose the first one. 
        objectTree = specialProperty.children[0].values[0];
      }

      const label = getLabel(objectTree.getPredicate(), tree);
      row[label] = getValue(objectTree, tree);
      specialHeaderNames.add(label);
    }
    rows.push(row);
  }

  const csvContent = json2csv.parse(rows,
    {
      // Specify the order of columns.
      // Special properties include wkts, which can be very large.
      // Therefore we want them all the way to the right.
      fields: ['resource', ...normalHeaderNames, ...specialHeaderNames]
    }
  )
  saveAs(
    new Blob([csvContent], {type: "text/plain;charset=utf-8"}),
    createDownloadFilename(downloadFilenameBase));
}
