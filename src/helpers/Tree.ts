import * as _ from "lodash";
import * as N3 from 'n3'
import { prefix } from "../prefixes";
import { getPrefixes } from "../facetConf";
export default class TreeNode {
  private term: N3.Term;
  private childrenCount = 0;
  private parent: TreeNode;
  private statements: N3.Quad[];
  private predicate: N3.Term;
  private label: string;
  private children: {
    [pred: string]: TreeNode[];
  } = {};
  private depth = 0;
  /**
   * Private methods
   */
  private constructor(term: N3.Term, statements: N3.Quad[], predicate: N3.Term, depth: number, parent: TreeNode) {
    this.term = term;
    this.statements = statements;
    this.depth = depth;
    this.predicate = predicate;
    this.parent = parent;
  }

  public getRoot(): TreeNode {
    if (!this.parent) return this;
    return this.parent.getRoot();
  }
  public setLabel(label: string) {
    this.label = label;
    return;
  }
  public getLabel() {
    if (this.label) return this.label;
    const rdfsLabel = this.find([prefix(getPrefixes(), "rdfs", "label"), null])
      .limit(1)
      .exec();
    if (rdfsLabel.length) return rdfsLabel[0].getTerm().value;
    return null;
  }
  private addChild(predTerm: N3.Term, objTerm: N3.Term) {
    const predTermVal = predTerm.value;
    this.childrenCount++;
    if (!this.children[predTermVal]) this.children[predTermVal] = [];
    const obj = TreeNode.fromStatements(objTerm, this.statements, predTerm, this.depth + 1, this);
    this.children[predTermVal].push(obj);
  }
  private populateChildren(statements: N3.Quad[]) {
    if (this.term.termType === "Literal") {
      //nothing to pulate. it's a leaf
    } else {
      for (const statement of statements) {
        //avoid cyclic references. This is a _tree_
        if (this.termEquals(statement.subject) && !this.parentExists(statement.object)) {
          this.addChild(statement.predicate, statement.object);
        }
      }
    }
  }

  private parentExists(term: N3.Term): boolean {
    //start checking self
    if (this.termEquals(term)) return true;
    //now check parents
    const parent = this.getParent();
    if (parent) return parent.parentExists(term);
    return false;
  }
  public getChildren(predicate?: string): TreeNode[] {
    if (!predicate) return _.flatten<TreeNode>(_.values(this.children));
    if (this.children[predicate]) return this.children[predicate];
    return [];
  }
  /**
   * Public methods
   */
  public hasChildren(): boolean {
    return !!_.size(this.children);
  }

  public getStatements() {
    return this.statements;
  }
  public termEquals(term: N3.Term) {
    return this.term.value === term.value;
  }
  public termMatches(requirements: QueryObject | string) {
    if (typeof requirements === "string") return this.term.value === requirements;
    return !(
      (requirements.value && requirements.value !== this.term.value) ||
      (requirements.language && (this.term.termType !== "Literal" || requirements.language !== this.term.language)) ||
      (requirements.datatype && (this.term.termType !== "Literal" || requirements.datatype !== this.term.datatypeString)) ||
      (requirements.termType && requirements.termType !== this.term.termType) ||
      (requirements.filter && !requirements.filter(this.term))
    );
  }
  public getDepth() {
    return this.depth;
  }
  public getNquads(): Promise<string> {
    const writer = new N3.Writer();
    for (const s of this.statements) {
      writer.addQuad(s);
    }
    return new Promise<string>((resolve, reject) => {
      writer.end((error, result) => {
        if (error) return reject(error)
        resolve(result)
      });

    })
  }
  public find(...pattern: QueryPattern[]) {
    return new Query(this, pattern).isRoot();
  }
  public getChildrenCount() {
    return this.childrenCount;
  }
  public getParent() {
    return this.parent;
  }
  public getParents(): TreeNode[] {
    const parents: TreeNode[] = [];
    if (this.parent) {
      return [this.parent].concat(this.parent.getParents());
    }
    return parents;
  }
  public getTerm() {
    return this.term;
  }
  public getLevel() {
    return this.depth;
  }
  public getKey(): string {
    return this.predicate.value + this.depth + this.childrenCount + this.term.value;
  }
  public getPredicate(): N3.Term {
    return this.predicate;
  }
  public toJson(): Object {
    return {
      term: this.term,
      count: this.childrenCount,
      children: this.getChildren().map(c => c.toJson())
    };
  }
  public static fromStatements(
    forTerm: N3.Term,
    statements: N3.Quad[],
    predicate: N3.Term = null,
    level = 0,
    parent: TreeNode = null
  ) {
    const tree = new TreeNode(forTerm, statements, predicate, level, parent);
    tree.populateChildren(statements);
    return tree;
  }
}

export type QueryObject = {
  value?: string;
  language?: string;
  datatype?: string;
  termType?: N3.Term["termType"];
  filter?: (term: N3.Term) => boolean;
};
export type QueryPattern = Array<string | QueryObject>;

export class Query {
  private pattern: QueryPattern;
  private tree: TreeNode;
  private returnDepth = -1;
  private _limit = -1;
  private rootQuery = false;
  private nextPatterns: QueryPattern[] = [];
  constructor(tree: TreeNode, _patterns: QueryPattern[]) {
    var patterns = _.clone(_patterns);
    this.pattern = patterns.shift();
    if (!this.pattern) this.pattern = [];

    this.tree = tree;

    this.nextPatterns = patterns;
  }
  public isRoot(isRoot = true) {
    this.rootQuery = isRoot;
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
  private adjustResultsPerLimit(results: TreeNode[]) {
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
    var finalResults = this.adjustResultsPerLimit(results);
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
  public or(pattern: QueryPattern) {
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
      ? _.flatten(
          matchingObjs.map(node =>
            node
              .find(pattern)
              .isRoot(false)
              .exec()
          )
        )
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
  private copy(withPattern: QueryPattern) {
    const q = new Query(this.tree, [withPattern]);
    q._limit = this._limit;
    q.returnDepth = this.returnDepth;
    return q;
  }
}
