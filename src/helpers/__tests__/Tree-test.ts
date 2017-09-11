//external dependencies
import * as chai from "chai";
var expect = chai.expect;
import * as N3 from 'n3'
import * as fs from 'fs-extra'
import * as path from 'path'
import Tree from '../Tree'
import prefixes from 'prefixes'

async function getTree(fromFile:string, forStatement:string) {
  const string = await fs.readFile(path.resolve(__dirname, 'data', fromFile), 'utf8')
  const statements = N3.Parser().parse(string);
  return Tree.fromStatements(forStatement,statements)
}
describe("Tree", function() {
  var pdokTree:Tree
  var geosoupTree:Tree
  before(async function() {
    pdokTree = await getTree('pdok_test.nt','https://data.pdok.nl/cbs/2015/id/buurt/BU01060710')
    geosoupTree = await getTree('geosoup.ttl','https://cultureelerfgoed.nl/id/monument/511321')
  });
  it("Root node should have correct shape", function() {
    expect(pdokTree.getParent()).to.be.undefined;
    expect(pdokTree['getChildren']()).to.have.lengthOf(54)
    expect(pdokTree['childrenCount']).equal(54);
  });
  describe("Find", function() {
    it ("Should find root level nodes", function() {
      const matches = pdokTree.find(['https://data.pdok.nl/cbs/2015/vocab/buurtNaam']).exec();
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].getTerm()).to.equal(`"De Stoepen"@nl`)
    })
    it("Should return leafs when empty match is given", function() {
      var matches = pdokTree.find([]).exec();
      expect(matches).to.have.lengthOf(55);
      matches = pdokTree.find().exec();
      expect(matches).to.have.lengthOf(55);
    })
    it("Should find deep nodes", function() {
      var matches = pdokTree.find(['http://www.opengis.net/ont/geosparql#hasGeometry', null, 'http://www.opengis.net/ont/geosparql#asWKT']).exec();
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].getTerm().indexOf('"')).to.equal(0)//should be a literal
      expect(matches[0].getLevel()).to.equal(2)//should be a literal
    })
    it("Should return other node if specified", function() {
      var matches = pdokTree.find(['http://www.opengis.net/ont/geosparql#hasGeometry', null, 'http://www.opengis.net/ont/geosparql#asWKT']).offset(1).exec();
      expect(matches).to.have.lengthOf(1);
      const match = matches[0];
      expect(match.getTerm().indexOf('http')).to.equal(0)//should be an iri
      expect(match.getChildrenCount()).to.equal(2)
    })
    it("Find WKT", function() {
      var matches = pdokTree.find([prefixes.geo + 'hasGeometry', null, prefixes.geo + 'asWKT']).exec();
      expect(matches).to.have.lengthOf(1);
    })
    // it.only("Should not have duplicate results", function() {
    //   var matches = geosoupTree.find([prefixes.geo + 'hasGeometry', null, prefixes.geo + 'asWKT']).exec();
    //   expect(matches).to.have.lengthOf(1);
    // })
  });
});
