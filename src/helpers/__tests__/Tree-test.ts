//external dependencies
import * as chai from "chai";
var expect = chai.expect;
import * as N3 from 'n3'
import * as fs from 'fs-extra'
import * as path from 'path'
import Tree from '../Tree'
import prefixes from 'prefixes'
describe("Tree", function() {
  var tree:Tree
  before(async function() {
    const n3String = await fs.readFile(path.resolve(__dirname, 'data', 'test.nt'), 'utf8')
    const statements = N3.Parser().parse(n3String);
    tree = Tree.fromStatements('https://data.pdok.nl/cbs/2015/id/buurt/BU01060710',statements)
  });
  it("Root node should have correct shape", function() {
    expect(tree.getParent()).to.be.undefined;
    expect(tree['getChildren']()).to.have.lengthOf(54)
    expect(tree['childrenCount']).equal(54);
  });
  describe("Find", function() {
    it ("Should find root level nodes", function() {
      const matches = tree.find(['https://data.pdok.nl/cbs/2015/vocab/buurtNaam']);
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].getTerm()).to.equal(`"De Stoepen"@nl`)
    })
    it("Should return leafs when empty match is given", function() {
      var matches = tree.find([]);
      expect(matches).to.have.lengthOf(55);
      matches = tree.find();
      expect(matches).to.have.lengthOf(55);
    })
    it("Should find deep nodes", function() {
      var matches = tree.find(['http://www.opengis.net/ont/geosparql#hasGeometry', null, 'http://www.opengis.net/ont/geosparql#asWKT']);
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].getTerm().indexOf('"')).to.equal(0)//should be a literal
      expect(matches[0].getLevel()).to.equal(2)//should be a literal
    })
    it("Should return other node if specified", function() {
      var matches = tree.find(['http://www.opengis.net/ont/geosparql#hasGeometry', null, 'http://www.opengis.net/ont/geosparql#asWKT'], 1);
      expect(matches).to.have.lengthOf(1);
      const match = matches[0];
      expect(match.getTerm().indexOf('http')).to.equal(0)//should be an iri
      expect(match.getChildrenCount()).to.equal(2)
    })
    it("Find WKT", function() {
      var matches = tree.find([prefixes.geo + 'hasGeometry', null, prefixes.geo + 'asWKT']);
      expect(matches).to.have.lengthOf(1);
    })
  });
});
