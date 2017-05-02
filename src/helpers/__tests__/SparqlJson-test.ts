//external dependencies
import * as chai from 'chai';
import * as _ from 'lodash'
var expect = chai.expect;
import SparqlJson from '../SparqlJson';
var example = require('./sparql.json')
describe.only('SparqlJson', function() {
  var sparql:SparqlJson;
  before(function() {
    sparql = new SparqlJson(example);
  })
  it('get vars', function() {
    expect(sparql.getValuesForVar('sdf')).to.have.lengthOf(0);
    expect(sparql.getValuesForVar('sub')).to.have.lengthOf(10);
  })

})
