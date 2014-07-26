#! /usr/bin/env node

var cmds = {};
var cmdString = process.argv.join(" ");
var fs = require("fs");

if (cmdString.indexOf("ofile") == -1 || cmdString.indexOf("devkey") == -1){
  var err = "You must provide a exported file from Orchestrate and a development key\n";
  err += "$ orchesclone ofile=path/to/file devkey=development-app-key";
  throw new Error(err);
}

process.argv.forEach(function (cmd, index){
  if(index > 1){

    if(cmd.indexOf("ofile") > -1){
      cmds["liveAppData"] = orchestrateObject(cmd.split("=")[1]);
    }

    if(cmd.indexOf("devkey") > -1){
      cmds["devkey"] = cmd.split("=")[1];
    }
  }
});

cmds["devApp"] = require("orchestrate")(cmds.devkey);

var data = cmds["liveAppData"];

for(var i = 0; i < data.length; i++){
  if(data[i] != ""){
    var obj = JSON.parse(data[i])
    if(obj.kind == "item"){
      cmds["devApp"].put(obj.path.collection, obj.path.key, obj.value)
      .fail(function (err){
        if(err){
          throw new Error(err);
        }
      });
    }
  }
}



function orchestrateObject(pathToFile) {
  return fs.readFileSync(pathToFile, {encoding: "utf8"}).split("\n");
}
