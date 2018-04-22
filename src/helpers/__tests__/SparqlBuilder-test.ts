//external dependencies
import * as chai from "chai";
var expect = chai.expect;
import Builder from '../SparqlBuilder'

describe("SparqlBuilder", function() {
  it('should work without starting query', function() {
    const b = Builder.get();
    expect(b.toString()).to.equal('SELECT * WHERE {  }\nLIMIT 10');
  })
});
