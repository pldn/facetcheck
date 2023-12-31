//external dependencies
import * as chai from "chai";
var expect = chai.expect;
import * as N3 from 'n3'
import * as fs from 'fs-extra'
import * as path from 'path'
import Tree from '../Tree'
import { prefix} from '../../prefixes'
import {getPrefixes} from '../../facetConf'

async function getTree(fromFile:string, forStatement:N3.Term) {
  const string = await fs.readFile(path.resolve(__dirname, 'data', fromFile), 'utf8')
  const statements:N3.Quad[] = (<any>N3).Parser().parse(string);
  return Tree.fromStatements(forStatement,statements)
}
describe("Tree", function() {
  var pdokTree:Tree
  var geosoupTree:Tree
  before(async function() {
    pdokTree = await getTree('pdok_test.nt',N3.DataFactory.namedNode('https://data.pdok.nl/cbs/2015/id/buurt/BU01060710'))
    geosoupTree = await getTree('geosoup.ttl',N3.DataFactory.namedNode('https://cultureelerfgoed.nl/id/monument/511321'))
  });
  it("Root node should have correct shape", function() {
    expect(pdokTree.getParent()).to.be.null;
    expect(pdokTree['getChildren']()).to.have.lengthOf(55)
    expect(pdokTree['childrenCount']).equal(55);
  })
  describe("Find", function() {
    it ("Should find root level nodes", function() {
      const matches = pdokTree.find(['https://data.pdok.nl/cbs/2015/vocab/buurtNaam']).exec();
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].getTerm()).to.equal(`"De Stoepen"@nl`)
    })
    it("Should return leafs when empty match is given", function() {
      var matches = pdokTree.find([]).exec();
      expect(matches).to.have.lengthOf(56);
      matches = pdokTree.find().exec();
      expect(matches).to.have.lengthOf(56);
    })
    it("Should find deep nodes", function() {
      var matches = pdokTree.find(['http://www.opengis.net/ont/geosparql#hasGeometry', null, 'http://www.opengis.net/ont/geosparql#asWKT']).exec();
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].getTerm().termType).to.equal('literal')
      expect(matches[0].getLevel()).to.equal(2)
    })
    it("Should return other node if specified", function() {
      var matches = pdokTree.find(['http://www.opengis.net/ont/geosparql#hasGeometry', null, 'http://www.opengis.net/ont/geosparql#asWKT']).depth(1).exec();
      expect(matches).to.have.lengthOf(1);
      const match = matches[0];
      expect(match.getTerm().value.indexOf('http')).to.equal(0)//should be an iri
      expect(match.getChildrenCount()).to.equal(2)
    })
    it("Find WKT", function() {
      var matches = pdokTree.find([prefix(getPrefixes(), 'geo', 'hasGeometry'), null, prefix(getPrefixes(), 'geo', 'asWKT')]).exec();
      expect(matches).to.have.lengthOf(1);
    })
    it("Find WKT with limit", function() {
      var matches = geosoupTree.find([prefix(getPrefixes(), 'geo', 'hasGeometry'), null, prefix(getPrefixes(), 'geo', 'asWKT')]).limit(1).exec();//actually has 2 matches
      expect(matches).to.have.lengthOf(1);
    })
    // it.only("Should not have duplicate results", function() {
    //   var matches = geosoupTree.find([prefixes.geo + 'hasGeometry', null, prefixes.geo + 'asWKT']).exec();
    //   expect(matches).to.have.lengthOf(1);
    // })
  });
});
