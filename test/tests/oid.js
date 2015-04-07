var assert = require("assert");
var path = require("path");
var local = path.join.bind(path, __dirname);

describe("Oid", function() {
  var NodeGit = require("../../");
  var Oid = NodeGit.Oid;

  var oid = "fce88902e66c72b5b93e75bdb5ae717038b221f6";

  before(function() {
    this.oid = Oid.fromString(oid);
  });

  it("can convert a string to an oid", function() {
    assert.ok(this.oid instanceof Oid);
  });

  it("can convert an oid to a string", function() {
    var string = this.oid.allocfmt();

    assert.equal(string, oid);
    assert.equal(this.oid.toString(), oid);
  });

  it("provides a custom inspect method to improve debugging", function() {
    var inspect = this.oid.inspect();

    assert.equal(inspect, "[Oid " + oid + "]");
  });

  it("can convert strings to oids in parameters", function() {
    return NodeGit.Repository.open(local("../repos/workdir"))
      .then(function(repo) {
        var revwalk = repo.createRevWalk();
        revwalk.sorting(NodeGit.Revwalk.SORT.TIME);

        revwalk.push(oid);

        return revwalk.getCommits(1);
      })
      .then(function(commits) {
        assert.equal(commits[0].toString(), oid);
      });
  });
});
