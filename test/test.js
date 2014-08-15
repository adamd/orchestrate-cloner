// since make_a_cat uses `util.print` to print stuff
// we'll overwrite it to test its output

var util = require('util')
, assert = require("assert")
, fs = require("fs")
, token = 'sample_token'
, nock = require('nock')
, db = require("orchestrate")(token)
, lazy  = require("lazy")
, samplefile = __dirname + "/test.json"
, sample_command = "orchesclone ofile=" + samplefile + "devkey=" + token;

var assert = require("assert")

var fakeOrchestrate = nock('https://api.orchestrate.io/')
  .get('/v0/users?query=new%20york')
  .reply(200, {
    "results": [
      {
        "path": {
          "collection": "users",
          "key": "sjkaliski@gmail.com",
          "ref": "0eb6642ca3efde45"
        },
        "value": {
          "name": "Steve Kaliski",
          "email": "sjkaliski@gmail.com",
          "location": "New York",
          "type": "paid",
          "gender": "male"
        },
        "score": 0.10848885029554367
      }
    ],
    "count": 1,
    "max_score": 0.10848885029554367
  })
  .delete('/v0/users?force=true')
  .reply(204)
  .head('/v0')
  .reply(200)

suite('CLI', function (){
  test('Check if ofile exists', function (done){
    assert.equal(true, fs.existsSync(samplefile))
    done()
  });

  test('Check if key is valid', function (done){
    db.ping()
      .then(function (res) {
        assert.equal(200, res.statusCode)
        done()
      });
  });

  test('Read file', function(done){
    var file  = fs.createReadStream(samplefile);
    new lazy(file).lines
        .forEach(function(line){
            var obj = JSON.parse(line.toString());

        });

    file.on('end', function() {
      done()
    });

  });
});
