var async = require("async"); 

exports.put = function (dbObj, recordObj, callback) {
    console.log(recordObj); 
}; 

//this is a temp name 
exports.random = function (page, callback) {
    page.links.next.get().then(function (page) {
        callback(page); 
    }); 
}; 

exports.graph = function (db1, collection, callback) {
    db1.search(collection, '*')
    .then(function (result) {
        callback(result.body.total_count); 
    }); 
}; 

exports.buildList = function (obj1, obj2, db1, db2, callback) {
    var that = this; 
    obj1.collectionToSync.forEach(function (collection){
        that.graph(db1, collection, function (total){
            console.log(total); 
        }); 
    });
}; 