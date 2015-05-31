var async = require('async');

var CustomDB = function(opts){
    var _this = this;
    _this.byIndex = {};
    _this.byId = [];
    _this.byX = [];
    // _this.byY = [];
    opts.indexes.forEach(function(index){
        _this.byIndex[index] = {};
    });
    _this.indexes = Object.keys(_this.byIndex);
};
CustomDB.prototype = {
    put: function(data){
        // Rudimentary workaround. FIXME.
        if(this.byId[data.id]){
            this.delete(data.id);
        }

        this.byId[data.id] = data;

        // Index by x,y coord
        if(!this.byX[data.x]){
            this.byX[data.x] = [];
        }
        this.byX[data.x][data.y] = data;

        // There's little reason to do the opposite way.
        // if(!this.byY[data.y]){
        //     this.byY[data.y] = [];
        // }
        // this.byY[data.y][data.x] = data;

        for(var i=0; i<this.indexes.length; i++){
            // Skip if this index doesn't exist
            if(!data[this.indexes[i]]){
                continue;
            }

            // If the index type doesn't exist for this index name, create it.
            // This is fairly gross, but probably faster.
            if(!this.byIndex[this.indexes[i]][data[this.indexes[i]]]){
                this.byIndex[this.indexes[i]][data[this.indexes[i]]] = {};
            }
            this.byIndex // Set the index
                [this.indexes[i]] // for this index name
                [data[this.indexes[i]]] // for this index type
                [data.id] = data; // for this data id
        }
    },
    delete: function(id){
        var data = this.byId(id);
        if(!data){
            return;
        }
        delete this.byId[id];
        delete this.byX[data.x][data.y];

        for(var i=0; i<this.indexes.length; i++){
            if(this.byIndex[this.indexes[i]][data[this.indexes[i]]][data.id]){
                delete this.byIndex[this.indexes[i]][data[this.indexes[i]]][data.id];
            }
        }

    },
    // This is unnecessary. Update by reference. Delete & re-add to refresh
    // any broken indexes.
    // update: function(data){
    //
    // },
    putAllSync: function(aData){
        for(var i=0; i<aData.length; i++){
            this.put(aData[i]);
        }
    },
    putAll: function(aData, cb){
        var _this = this;
        setTimeout(function(){
            _this.putAllSync(aData);
            cb();
        });
    },
    getAll: function(){
        return this.byId;
    },
    getAllByKey: function(key, value){
        return this.byIndex[key][value];
    },
    getByCoord: function(x, y){
        return this.byX[x][y];
    },
    /**
     * Get items in bounds.
     * This returns a copy of the database that fits the criteria.
     * Note that this is fast for small datasets and slow for large ones.
     * @param {Array} topleft   x,y array for the top-left corner
     * @param {Array} bottomright   x,y array for the bottom-right corner
     */
    getByBoundingBox: function(topleft, bottomright){
        // Slice out the x component
        return this.byX.slice(topleft[0], bottomright[0]+1).map(function(row){
            // Then slice the y component for each row.
            return row.slice(topleft[1], bottomright[1]+1);
        });
    }
};

module.exports = CustomDB;
