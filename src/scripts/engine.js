var async = require('async');
var CustomDB = require('./db-custom');

var db = new CustomDB({
    indexes: ['class']
});

var gameDb;

var actions = {
    startNew: function(nonce, opts){
        var i = 0;
        for(var x=0; x<opts.width; x++){
            for(var y=0; y<opts.height; y++){
                db.put({
                    id: i++,
                    x: x,
                    y: y,
                    class: Math.random() > 0.5 ? 'normal' : 'abnormal'
                });
            }
        }
        console.log(db);
        postMessage({
            nonce: nonce,
            opts: 'ready'
        });
    },
    queryMap: function(nonce, opts){
        postMessage({
            nonce: nonce,
            opts: db[opts.method].apply(db, opts.args)
        });
    }
};

console.log('init worker');
addEventListener('message', function(e) {
    console.log('message recieved', e.data.cmd);
  actions[e.data.cmd](e.data.nonce, e.data.opts);
}, false);
