import * as _ from 'lodash'
export default class ResourceTreeItem {
  private index:{[iri:string]: ResourceTreeItem} = {}//only used by root el
  // public unknown:boolean
  public parent:ResourceTreeItem;
  constructor(public iri:string,  public children:ResourceTreeItem[] = []) {

    children.forEach((child) => {
      this.addChild(child);
    })
  }

  addChild(child:ResourceTreeItem) {
    if (!child) return;
    if (this.children.indexOf(child) <0) this.children.push(child)
    if (child.parent) {
      //simply overwrite
      _.remove(child.parent.children, child);
    }
    child.parent = this;
  }
  getIndex() {
    return this.index;
  }
  createResource(iri:string):ResourceTreeItem {
    if (this.parent) {
      return this.getRoot().createResource(iri);
    }
    var resource = new ResourceTreeItem(iri);
    this.addChild(resource);
    this.addToIndex(resource);
    return resource;
  }
  findResourceWithIri(findIri:string):ResourceTreeItem {
    if (this.iri === findIri) return this;
    for (var i = 0; i < this.children.length; i++) {
      const found = this.children[i].findResourceWithIri(findIri)
      if (found) {
        return found
      }
    }
  }
  findOrCreateResourceWithIri(findIri:string):ResourceTreeItem {
    var resource = this.findResourceWithIri(findIri);
    if (resource) return resource;
    return this.createResource(findIri)
  }
  getRoot():ResourceTreeItem {
    if (this.parent) {
      return this.parent.getRoot();
    } else {
      return this;
    }
  }
  hasResourceWithIri(findIri:string) {
    return (findIri in this.index)
  }
  getAllChildrenAsArray() {
    var children:ResourceTreeItem[] = _.clone(this.children);
    for (var i = 0 ; i < children.length; i++) {
      children = children.concat(children[i].getAllChildrenAsArray())
    }
    return children;
  }
  populateIndex() {
    this.getAllChildrenAsArray().forEach(child => {
      this.index[child.iri] = child
    })
  }
  addToIndex(resource:ResourceTreeItem) {
    this.index[resource.iri] = resource
  }
  getIndexCount() {
    return _.size(this.index)
  }

  removeChild(child:ResourceTreeItem) {
    if (this.children.indexOf(child) < 0) throw new Error('Tried to remove element that is not a child');
    _.pull(this.children, child);
    child.parent = undefined;
  }

  toJson():Object | true {
    if (!this.parent) {
      //root el, so first add yourself as root
      const json = {};
      json[this.iri] = {};
      this.children.forEach((child) => {
        json[this.iri][child.iri] = child.toJson();
      })
      return json;
    } else {
      if (this.children.length) {
        const json = {};
        this.children.forEach((child) => {
          json[child.iri] = child.toJson();
        })
        return json;
      }
      return true;
    }
  }
  // toN3(subRelation: string):N3.Statement[] {
  //   var statements:N3.Statement[] = [];
  //   if (this.parent) statements.push({subject: this.iri, predicate: subRelation, object: this.parent.iri})
  //
  //   this.children.forEach((child) => {
  //     statements = statements.concat(child.toN3(subRelation));
  //   })
  //   return statements;
  // }



  /**
  Get parent datatype urls as array, starting from root
  **/
  getParentHierarchy():string[] {
    var parents:string[] = [this.iri];
    var i:ResourceTreeItem = this;
    while (i.parent) {
      parents.push(i.parent.iri);
      i = i.parent;
    }
    return parents.reverse();
  }
  // equals(otherResource:ResourceTreeItem) {
  //   return this.iri === otherResource.iri
  // }

  getLowestDenominator(otherResource:ResourceTreeItem) {
    if (this === otherResource) return this;//already the same
    if (!otherResource) return this;
    // if (!lhs && rhs) return getDataTypeFromString(rhs);
    // if (!rhs && lhs) return getDataTypeFromString(lhs);
    // const lhsDataType = getDataTypeFromString(lhs)
    // const rhsDataType = getDataTypeFromString(rhs)


    //ok, lets do some tricky stuff
    const thisParents = this.getParentHierarchy()
    const rhsParents = otherResource.getParentHierarchy()
    var common:ResourceTreeItem;
    const ROOT = this.getRoot();
    for (var i = 0; i < thisParents.length; i++) {
      if (thisParents[i] === rhsParents[i]) {
        common = ROOT.findResourceWithIri(thisParents[i])
      } else {
        //no common datatype anymore.
        break;
      }
    }
    return common;


  }


  static fromJson(jsonInput:Object, iri?:string, root = true):ResourceTreeItem {
      if (root) {
        if (Object.keys(jsonInput).length !== 1) throw new Error('Can only have 1 root object')
        const resource = new ResourceTreeItem(Object.keys(jsonInput)[0])
        if (typeof jsonInput[resource.iri] === 'object') {
          for (var iriKey in jsonInput[resource.iri]) {
            resource.addChild(ResourceTreeItem.fromJson(jsonInput[resource.iri][iriKey], iriKey, false))
          }
        }
        resource.populateIndex()
        return resource;

      } else {
        // if (typeof jsonInput[resource.iri] === 'object') {
        const resource = new ResourceTreeItem(iri)
        for (var iriKey in jsonInput) {
          resource.addChild(ResourceTreeItem.fromJson(jsonInput[iriKey], iriKey, false))
        }
        return resource;
      }
    }
  // static fromN3(subRelation: string, statements:N3.Statement[]):ResourceTreeItem {
  //   // ResourceTreeItem
  //   var tree = new ResourceTreeItem('__root__');
  //   statements.forEach((statement) => {
  //     if (statement.predicate === subRelation) {
  //       var sub = tree.findResourceWithIri(statement.subject) || new ResourceTreeItem(statement.subject)
  //       var obj = tree.findResourceWithIri(statement.object) || new ResourceTreeItem(statement.object)
  //       obj.addChild(sub);
  //       if (!obj.parent) tree.addChild(obj);
  //     }
  //   })
  //   if (tree.children.length === 1) {
  //     tree = tree.children[0];
  //     tree.parent = undefined;
  //   }
  //   tree.populateIndex();
  //   return tree;
  // }
  // static fromJsonFile(filename:string):ResourceTreeItem {
  //   const json = fs.readFileSync(filename, 'UTF-8');
  //   return ResourceTreeItem.fromJson(JSON.parse(json))
  // }
  // static fromN3File(subRelation:string, filename:string):Promise<ResourceTreeItem> {
  //   const ntriples = fs.readFileSync(filename, 'UTF-8');
  //   return new Promise<ResourceTreeItem>(function(resolve, reject) {
  //     try {
  //
  //       var parser = N3.Parser();
  //       var statements:N3.Statement[] = [];
  //       parser.parse(ntriples, (e, statement, prefixes) => {
  //         if (e) return reject(e);
  //         if (!statement) {
  //           //finished
  //           resolve(ResourceTreeItem.fromN3(subRelation, statements))
  //         }
  //         statements.push(statement)
  //       })
  //
  //     } catch (e) {
  //       reject(e)
  //     }
  //
  //   })
  //   // return ResourceTreeItem.fromN3(ntriples)
  // }
}
