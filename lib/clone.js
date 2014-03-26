var assert = require("assert"); 
var sync = require("./sync"); 
/** 
 * Set the initial object. 
 * Layout based off of Bowery Client for Orchestrate
 * Object layout { 
 * token : string, 
 * collectionToSync: array
 * }
 **/ 

function Clone (ProdObj, DevObj){
  assert(ProdObj.token, 'API key required.')
  assert(DevObj.token, 'API key required.')
  if (!(this instanceof Clone)) {
    return new Clone(ProdObj, DevObj); 
  }
  
  this.prodobj = ProdObj; 
  this.devobj = DevObj; 
  this.prodDB = require("orchestrate")(ProdObj.token); 
  this.devDB = require("orchestrate")(DevObj.token); 
  
}

Clone.prototype.sync = function () {
    /** 
     * If state is dev then the sync goes this way
     * production -> dev
     **/ 
    sync.buildList(this.prodobj, this.devobj, this.prodDB, this.devDB, function (arrayList){
        console.log(arrayList); 
    });
}

module.exports = Clone;