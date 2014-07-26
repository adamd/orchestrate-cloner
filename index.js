#! /usr/bin/env node


//base variables needed.
var cmds = {};
var cmdString = process.argv.join(" ");
var fs = require("fs");


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

//loop over array

for(var i = 0; i < data.length; i++){

  //make sure array el is not empty string
  if(data[i] != ""){
    var obj = JSON.parse(data[i])
    if(obj.kind == "item"){

      //put the object in the dev app

      cmds["devApp"].put(obj.path.collection, obj.path.key, obj.value)

      //if err throw

      .fail(function (err){
        if(err){
          throw new Error(err);
        }
      });
    }
  }
}



/**
  * loads file
  * @param {string} pathToFile (exported data from live app on orchestrate)
**/ 

function orchestrateObject(pathToFile) {
  return fs.readFileSync(pathToFile, {encoding: "utf8"}).split("\n");
}
