var async = require('async');
window.PouchDB = require('pouchdb');
require('pouchdb/extras/memory');


var db = new PouchDB('dbname', {adapter: 'memory'});

var width = 100;

var i=0;

console.time('first put');

db.put({
    _id: String(i++),
    name: 'Jane',
    age: 24
})
.catch(function(e){
    console.log(e);
})
.then(function(){
    // idb Chrome: ~7k-10k msec
    // websql Chrome: ~500 msec
    // memory Chrome: ~300 msec
    console.timeEnd('first put');


    console.time('whole map');
    // Loop through `width` items in series
    async.eachSeries(new Array(width), function(a, cb){

        // Create a row of `width` items
        var row = [];
        for(var j=0; j<width; j++){
            // Random data, unique ID.
            row.push({
                _id: String(i++),
                name: 'David',
                age: 68
            });
        }

        // Insert it into pouch
        console.log('inserting row...');
        console.time('insert');
        db.bulkDocs(row).then(function(){
            console.timeEnd('insert');
            cb();
        });
    }, function(){
        //idb Chrome: 4k-5k msec
        // websql Chrome: 7-8k msec
        // memory Chrome: 8k msec
        console.timeEnd('whole map');
    });

});
