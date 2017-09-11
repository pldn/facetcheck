import * as N3 from 'n3';
import * as _ from 'lodash'
export default class TreeNode {
  private term:string;
  private childrenCount = 0
  private parent:TreeNode;
  private statements:N3.Statement[]
  private predicate:string
  private children: {
    [pred:string]: TreeNode[]
  } = {}
  private depth = 0;
  /**
   * Private methods
   */
  private constructor(term:string, statements:N3.Statement[], depth:number) {
    this.term = term;
    this.statements = statements;
    this.depth = depth;
  }


  private setParent(parent:TreeNode) {
    this.parent = parent;
  }
  private addChild(predTerm:string, objTerm:string) {
    this.childrenCount++;
    if (!this.children[predTerm]) this.children[predTerm] = [];
    const obj = TreeNode.fromStatements(objTerm, this.statements, this.depth+1);
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
  public getChildren(predicate?:string):TreeNode[] {
    if (!predicate) return _.flatten<TreeNode>(_.values(this.children))
    if (this.children[predicate]) return this.children[predicate];
    return [];
  }
  /**
   * Public methods
   */
  public getStatements() {
    return this.statements;
  }
  public termEquals(term:string) {
    return this.term === term;
  }
  public getDepth() {
    return this.depth;
  }
  public getNquads():Promise<string> {
    return new Promise<string>((resolve,reject) => {
      const writer = N3.Writer();
      this.statements.forEach(s => writer.addTriple(s));
      writer.end(function(error:Error,result:string) {
        if (error) return reject(error)
        resolve(result);
      })
    })
  }
  public find(pattern?:string[])  {
    return new Query(this, pattern);

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
    return this.depth;
  }

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

export class Query {
  private pattern:string[]
  private tree:TreeNode
  private returnOffset = -1
  constructor(tree:TreeNode, pattern:string[]) {
    this.pattern = pattern || [];
    this.tree = tree;
  }

  private patternHasBoundVariables() {

    return !!this.pattern.find(p => !!p);
  }
  public offset(offset:number) {
    this.returnOffset = offset
    return this;
  }
  public exec():TreeNode[] {
    const hasMatchesToBeMade = this.patternHasBoundVariables();
    //we've reached a leaf node. If there are no more matches to be made, just return this one
    if (this.tree.getChildrenCount() === 0 && (this.pattern.length === 0  || !hasMatchesToBeMade)) return [this.tree];


    const pattern = _.clone(this.pattern)
    const matchPred = pattern.shift();
    const matchingPreds = this.tree.getChildren(matchPred);
    const matchObj = pattern.shift();

    var matchingObjs = matchingPreds;
    if (matchObj) {
      matchingObjs = matchingPreds.filter(node => node.termEquals(matchObj));
    }

    const results = _.flatten(matchingObjs.map(node => node.find(pattern).exec()))

    if (this.returnOffset < 0) return results;

    /**
     * Traverse upwards in the tree to select the node we're interested in
     */
    const selectedResults:TreeNode[] = []
    for (const result of results) {
      var selectedNode = result;

      for (var l = selectedNode.getDepth(); l > this.returnOffset ; l--) {

        selectedNode = selectedNode.getParent();
      }
      selectedResults.push(selectedNode);
    }

    return selectedResults;
  }
}
