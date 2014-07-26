#! /usr/bin/env node


//base variables needed.
var cmds = {};
var cmdString = process.argv.join(" ");
var fs = require("fs");
var async = require("async");

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

      cmds["liveAppData"] = orchestrateObject(cmd.split("=")[1]);
    }

    //check to make sure yet again devkey is a command issued,


    if(cmd.indexOf("devkey") > -1){

      //add key to cmds obj

      cmds["devkey"] = cmd.split("=")[1];
    }
  }
});


//orchestrate dev app obj;
cmds["devApp"] = require("orchestrate")(cmds.devkey);

//short variable for live app data;
var data = cmds["liveAppData"];



async.series([
    function (callback){
      loopOverArray('item', data, 'one', function (){
        callback(null, 'one');
      });
    },
    function (callback){
      loopOverArray('relationship', data, 'one', function (){
        callback(null, 'two');
      });
    }
]);

/**
  * loops over the array pulled from exported file
  * @param {string} kind (the kind of object it is)
  * @param {array} array (array of data read from file)
  * @param {string} seriesPos (which index of async.series function it is)
**/

function loopOverArray (kind, array, seriesPos, callback){

  var finishCount = 0;
  var runCount = 0;

  array.forEach(function (obj){
    if(obj != ""){
      obj = JSON.parse(obj);
      if(obj.kind == kind){
        finishCount++;
      }
    }
  });

  for(var i = 0; i < array.length; i++){
    if(array[i] != ""){
      var obj = JSON.parse(array[i]);
      if(obj.kind == kind){
        db = fetchNextPiece(obj, cmds["devApp"]);
        db
        .then(function (result){
          runCount++;
          if(runCount == finishCount){
            callback();
          }
        })
        .fail(function (err){
          throw new Error(err);
        });
      }
    }
  }
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
  }
}

/**
  * loads file
  * @param {string} pathToFile (exported data from live app on orchestrate)
**/

function orchestrateObject(pathToFile) {
  return fs.readFileSync(pathToFile, {encoding: "utf8"}).split("\n");
}
