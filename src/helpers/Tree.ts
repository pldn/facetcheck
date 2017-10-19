import * as N3 from 'n3';
import * as _ from 'lodash'
import {Statements,Term,ntriplyToNquads} from '@triply/triply-node-utils/build/src/nTriply'
import { default as prefixes, prefix } from "prefixes";
export default class TreeNode {
  private term:Term;
  private childrenCount = 0
  private parent:TreeNode;
  private statements:Statements
  private predicate:string
  private label:string;
  private children: {
    [pred:string]: TreeNode[]
  } = {}
  private depth = 0;
  /**
   * Private methods
   */
  private constructor(term:Term, statements:Statements,predicate:string, depth:number, parent: TreeNode) {
    this.term = term;
    this.statements = statements;
    this.depth = depth;
    this.predicate = predicate;
    this.parent = parent;
  }

  public getRoot():TreeNode {
    if (!this.parent) return this;
    return this.parent.getRoot();
  }
  public setLabel(label:string) {
    this.label = label;
    return;
  }
  public getLabel() {
    if (this.label) return this.label;
    const rdfsLabel =  this.find([prefix('rdfs', 'label'), null]).limit(1).exec();
    if (rdfsLabel.length) return rdfsLabel[0].getTerm().value;
    return null;
  }
  private addChild(predTerm:Term, objTerm:Term) {
    const predTermVal = predTerm.value;
    this.childrenCount++;
    if (!this.children[predTermVal]) this.children[predTermVal] = [];
    const obj = TreeNode.fromStatements(objTerm,this.statements, predTermVal,  this.depth+1, this);
    this.children[predTermVal].push(obj)
  }
  private populateChildren(statements:Statements) {
    if (this.term.termType === 'literal') {
      //nothing to pulate. it's a leaf
    } else {
      for (const statement of statements) {
        //avoid cyclic references. This is a _tree_
        if (this.termEquals(statement[0]) && !this.parentExists(statement[2])) {
          this.addChild(statement[1], statement[2]);
        }
      }
    }
  }

  private parentExists(term:Term):boolean {
    //start checking self
    if (this.termEquals(term)) return true;
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
  public hasChildren():boolean {
    return !!_.size(this.children)
  }

  public getStatements() {
    return this.statements;
  }
  public termEquals(term:Term) {
    return this.term.value === term.value;
  }
  public termMatches(requirements: QueryObject) {
  return !(
    (requirements.value && requirements.value !== this.term.value) ||
    (requirements.language && requirements.language !== this.term.language) ||
    (requirements.datatype && requirements.datatype !== this.term.datatype) ||
    (requirements.termType && requirements.termType !== this.term.termType) ||
    (requirements.filter && !requirements.filter(this.term))
  );
}
  public getDepth() {
    return this.depth;
  }
  public getNquads():Promise<string> {
    return ntriplyToNquads(this.statements)
  }
  public find(...pattern:QueryPattern[])  {
    return new Query(this, pattern).isRoot();

  }
  public getChildrenCount() {
    return this.childrenCount;
  }
  public getParent() {
    return this.parent;
  }
  public getParents():TreeNode[] {
    const parents:TreeNode[] = [];
    if (this.parent) {
      return [this.parent].concat(this.parent.getParents())
    }
    return parents;
  }
  public getTerm() {
    return this.term;
  }
  public getLevel() {
    return this.depth;
  }
  public getKey():string {
    return this.predicate + this.depth + this.childrenCount + this.term.value;
  }
  public getPredicate():string {
    return this.predicate
  }
  public toJson():Object {
    return {
      term: this.term,
      count: this.childrenCount,
      children: this.getChildren().map((c => c.toJson()))
    }
  }
  public static fromStatements(forTerm:Term, statements:Statements, predicate:string = null, level = 0, parent:TreeNode = null) {
    const tree = new TreeNode(forTerm, statements, predicate, level, parent);
    tree.populateChildren(statements);
    return tree;
  }
}

export type QueryObject = {
  value?: string;
  language?: string;
  datatype?: string;
  termType?: Term["termType"];
  filter?: (term: Term) => boolean;
};
export type QueryPattern = Array<string | QueryObject>;

export class Query {
  private pattern: QueryPattern;
  private tree: TreeNode;
  private returnDepth = -1;
  private _limit = -1;
  private rootQuery = false;
  private nextPatterns:QueryPattern[] = []
  constructor(tree: TreeNode, _patterns: QueryPattern[]) {
    var patterns = _.clone(_patterns)
    this.pattern = patterns.shift();
    if (!this.pattern) this.pattern = [];

    this.tree = tree;

    this.nextPatterns = patterns;
  }
  public isRoot(isRoot=true) {
    this.rootQuery = isRoot
    return this;
  }
  private patternHasBoundVariables() {
    return !!this.pattern.find(p => !!p);
  }
  public depth(depth: number) {
    this.returnDepth = depth;
    return this;
  }
  public limit(limit: number) {
    this._limit = limit;
    return this;
  }
  private adjustResultsPerLimit(results:TreeNode[]) {
    if (this._limit > 0) {
      results = results.slice(0, this._limit);
    }
    //make results unique. We could get non-distinct results if we're retrieving from e.g. a depth of 1, but at a depth
    //of 2 there are more than 1 leaf nodes
    var finalResults = _.uniqBy(results, n => n.getKey());

    return finalResults;
  }
  private postProcessResults(results: TreeNode[]) {
    if (!this.rootQuery) return results;
    var finalResults = this.adjustResultsPerLimit(results)
    if (this._limit > 0 && finalResults.length >= this._limit) {
      return finalResults;
    }
    if (!this.nextPatterns.length) {
      return finalResults;
    }
    for (const nextPattern of this.nextPatterns) {
      if (this._limit <= finalResults.length) return finalResults;
      const q = this.copy(nextPattern);
      q.limit(this._limit - finalResults.length);
      finalResults = this.adjustResultsPerLimit(finalResults.concat(q.exec()));
    }
    return finalResults;
  }
  public or(pattern:QueryPattern) {
    this.nextPatterns.push(pattern);
  }
  public exec(): TreeNode[] {
    const hasMatchesToBeMade = this.patternHasBoundVariables();
    //we've reached a leaf node. If there are no more matches to be made, just return this one
    if (this.tree.getChildrenCount() === 0 && (this.pattern.length === 0 || !hasMatchesToBeMade)) {
      if (this.returnDepth >= 0 && this.returnDepth !== this.tree.getDepth()) {
        return [];
      }
      return [this.tree];
    }

    const pattern = _.clone(this.pattern);
    const matchPred = pattern.shift();
    const matchingPreds = this.tree.getChildren(matchPred as string);
    const matchObj = pattern.shift();

    var matchingObjs = matchingPreds;
    if (matchObj) {
      matchingObjs = matchingPreds.filter(node => node.termMatches(matchObj));
    }

    const results = pattern.length
      ? _.flatten(matchingObjs.map(node => node.find(pattern).isRoot(false).exec()))
      : matchingObjs;
    if (this.returnDepth < 0) return this.postProcessResults(results);

    /**
     * Traverse upwards in the tree to select the node we're interested in
     */
    const selectedResults: TreeNode[] = [];
    for (const result of results) {
      var selectedNode = result;

      for (var l = selectedNode.getDepth(); l > this.returnDepth; l--) {
        selectedNode = selectedNode.getParent();
      }
      selectedResults.push(selectedNode);
    }
    return this.postProcessResults(selectedResults);


  }
  private copy(withPattern:QueryPattern) {
    const q = new Query(this.tree, [withPattern]);
    q._limit = this._limit;
    q.returnDepth = this.returnDepth;
    return q;
  }
}
