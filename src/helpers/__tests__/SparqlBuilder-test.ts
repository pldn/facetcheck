//external dependencies
import * as chai from "chai";
var expect = chai.expect;
import * as N3 from 'n3'
import * as fs from 'fs-extra'
import * as path from 'path'
import Builder from '../SparqlBuilder'
import prefixes from 'prefixes'

describe.only("SparqlBuilder", function() {
  it('should work without starting query', function() {
    const b = Builder.get();
    expect(b.toString()).to.equal('SELECT * WHERE { ?s ?p ?o. }');
  })
  it('add union clause', function() {
    const b = Builder.get();
    
  })
});
