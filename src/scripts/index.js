var worker = new Worker('/scripts/engine.js');

var workerCb = {};
var workerCbI = 0;
function queryWorker(method, opts, cb){
    var cbUnique = workerCbI++;
    console.log('unique nonce', cbUnique);
    workerCb[cbUnique] = cb;
    worker.postMessage({
        nonce: cbUnique,
        cmd: method,
        opts: opts
    });
}
worker.onmessage = function(e) {
    if(workerCb[e.data.nonce]){
        workerCb[e.data.nonce](e.data.opts);
        delete workerCb[e.data.nonce];
    } else {
        console.error('missing callback');
        console.log(e);
    }
};
worker.onerror = function(e) {
    console.log('Worker error: ', e);
};

//start the worker
queryWorker(
    'startNew',
    {
        width: 512,
        height: 512
    },
    function(resp){
        console.log('onready. Querying db.');
        console.time('a');
        queryWorker(
            'queryMap',
            {
                method: 'getAll',
                args: ['class', 'normal']
            },
            function(resp){
                console.timeEnd('a');
                // console.log('query success', JSON.stringify(resp,null,2));
            }
        );
    }
);
