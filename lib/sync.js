exports.put = function () {
    
}; 

exports.buildList = function (obj1, obj2, db1, db2, callback) {
    obj1.collectionToSync.forEach(function (collection){
        db1.list(collection, 10)
            .then(function (page) {
                console.log(page.body); 
            })
        .fail(function (err) {
    
        })   
    });
}; 