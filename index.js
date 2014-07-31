#! /usr/bin/env node


//base variables needed.
var cmds = {};
var cmdString = process.argv.join(" ");
var fs = require("fs");
var async = require("async");
var lazy  = require("lazy");

//double check to make sure the cmdstring has the parameters needed.

if (cmdString.indexOf("ofile") == -1 || cmdString.indexOf("devkey") == -1){
  var err = "You must provide a exported file from Orchestrate and a development key\n";
  err += "$ orchesclone ofile=path/to/file devkey=development-app-key";
  throw new Error(err);
}

//loop over each argument and add to the cmds obj

process.argv.forEach(function (cmd, index){
  if(index > 1){

    if(cmd.indexOf("ofile") > -1){

      //exported data from live app

      cmds["filePath"] = cmd.split("=")[1];
    }

    //check to make sure yet again devkey is a command issued,


    if(cmd.indexOf("devkey") > -1){

      //add key to cmds obj

      cmds["devkey"] = cmd.split("=")[1];
    }
  }
});


//orchestrate dev app obj;
var db = require("orchestrate")(cmds.devkey);

async.series([
    function (callback){
      loopOverArray('item', cmds.filePath, function (){
        callback(null, 'one');
      });
    },
    function (callback){
      loopOverArray('relationship', cmds.filePath, function (){
        callback(null, 'two');
      });
    },
    function (callback){
      loopOverArray('event', cmds.filePath, function (){
        callback(null, 'two');
      });
    }
], function (err, results){
  console.log("Success, file has been imported to the app containing the key" + cmds["devkey"]);
});

/**
  * loops over the array pulled from exported file
  * @param {string} kind (the kind of object it is)
  * @param {array} array (array of data read from file)
  * @param {string} seriesPos (which index of async.series function it is)
**/

function loopOverArray (kind, pathtofile, callback){
  var file  = fs.createReadStream(pathtofile);
  new lazy(file).lines
      .forEach(function(line){
          var obj = JSON.parse(line.toString());
          if(obj.kind == kind){
            wholeDB = fetchNextPiece(obj, db);
            wholeDB.fail(function (err){
              throw new Error(err);
            });
          }
      });

  file.on('end', function() {
    callback();
  });
}

/**
  * builds majority of the orchestrate call
  * @param {object} obj (single object from file)
  * @param {object} db (orchestrate module db object)
**/

function fetchNextPiece(obj, db){
  if(obj.kind == "item"){
    return db.put(obj.path.collection, obj.path.key, obj.value);
  } else if (obj.kind == "relationship"){
    return db.newGraphBuilder().create().from(obj.source.collection, obj.source.key).related(obj.relation).to(obj.destination.collection, obj.destination.key)
  } else if (obj.kind == "event"){
    return db.newEventBuilder().from(obj.path.collection, obj.path.key).type(obj.path.type).time(obj.path.timestamp).data(obj.value).create()
  }
}
