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

exports.buildList = function (obj1, obj2, db1, db2, callback) {
    var that = this; 
    obj1.collectionToSync.forEach(function (collection){
        db1.list(collection, 10)
            .then(function (page) {
                var obj = page;
                    while(obj.links && obj.links.next){
                        that.random(obj, function (response){
                            console.log('this?'); 
                        }); 
                    }
            })
        .fail(function (err) {
    
        });
    });
}; 