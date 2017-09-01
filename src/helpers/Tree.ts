import * as N3 from 'n3';
import * as _ from 'lodash'
export default class TreeNode {
  private term:string;
  private childrenCount = 0
  private parent:TreeNode;
  private statements:N3.Statement[]
  private children: {
    [pred:string]: TreeNode[]
  } = {}
  private level = 0;
  /**
   * Private methods
   */
  private constructor(term:string, statements:N3.Statement[], level:number) {
    this.term = term;
    this.statements = statements;
    this.level = level;
  }


  private setParent(parent:TreeNode) {
    this.parent = parent;
  }
  private addChild(predTerm:string, objTerm:string) {
    this.childrenCount++;
    if (!this.children[predTerm]) this.children[predTerm] = [];
    const obj = TreeNode.fromStatements(objTerm, this.statements, this.level+1);
    obj.setParent(this);
    this.children[predTerm].push(obj)
  }
  private populateChildren(statements:N3.Statement[]) {
    if (N3.Util.isLiteral(this.term)) {
      //nothing to pulate. it's a leaf
    } else {
      for (const statement of statements) {
        //avoid cyclic references. This is a _tree_
        if (statement.subject === this.term && !this.parentExists(statement.object)) {
          this.addChild(statement.predicate, statement.object);
        }
      }
    }
  }

  private parentExists(term:string):boolean {
    //start checking self
    if (this.getTerm() === term) return true;
    //now check parents
    const parent = this.getParent();
    if (parent) return parent.parentExists(term);
    return false;
  }
  private getChildren(predicate?:string):TreeNode[] {
    if (!predicate) return _.flatten<TreeNode>(_.values(this.children))
    if (this.children[predicate]) return this.children[predicate];
    return [];
  }
  private matches(term:string) {
    return this.term === term;
  }
  /**
   * Public methods
   */
  public find(_pattern:string[] = [], returnLevel = -1):TreeNode[] {
    const hasMatchesToBeMade = _pattern.find(p => !!p);
    //we've reached a leaf node. If there are no more matches to be made, just return this one
    if (this.childrenCount === 0 && (_pattern.length === 0  || !hasMatchesToBeMade)) return [this];


    const pattern = _.clone(_pattern)
    const matchPred = pattern.shift();
    const matchingPreds = this.getChildren(matchPred);
    const matchObj = pattern.shift();

    var matchingObjs = matchingPreds;
    if (matchObj) {
      matchingObjs = matchingPreds.filter(node => node.matches(matchObj));
    }

    const results = _.flatten(matchingObjs.map(node => node.find(pattern)))

    if (returnLevel < 0) return results;

    /**
     * Traverse upwards in the tree to select the node we're interested in
     */
    const selectedResults:TreeNode[] = []
    for (const result of results) {
      var selectedNode = result;
      console.log(selectedNode.level,returnLevel)
      for (var l = selectedNode.level; l > returnLevel ; l--) {
        console.log('resetting selected node')
        selectedNode = selectedNode.getParent();
      }
      selectedResults.push(selectedNode);
    }

    return selectedResults;
  }
  public getChildrenCount() {
    return this.childrenCount;
  }
  public getParent() {
    return this.parent;
  }
  public getTerm() {
    return this.term;
  }
  public getLevel() {
    return this.level;
  }
  // public getLeafs() {
  //   if (_.isEmpty(this.children)) {
  //     return [this];
  //   }
  //   var leafs:TreeNode[] = []
  //   for (const node of this.getChildren()) {
  //     leafs = leafs.concat(node.getLeafs())
  //   }
  //   return leafs;
  // }
  public toJson():Object {
    return {
      term: this.term,
      count: this.childrenCount,
      children: this.getChildren().map((c => c.toJson()))
    }
  }
  public static fromStatements(forIri:string, statements:N3.Statement[], level = 0) {
    const tree = new TreeNode(forIri, statements, level);
    tree.populateChildren(statements);
    return tree;
  }
}
