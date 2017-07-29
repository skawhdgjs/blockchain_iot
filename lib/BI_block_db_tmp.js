var mongoose = require('mongoose');
var async = require('async')

//initalize ip
class blockdb {

    constructor(opt, callback){

          this.ip = 'localhost';
          this.port = 27017;


          if(opt != undefined){
            if(opt.ip != undefined)
              this.ip = opt.ip;

            if(opt.port != undefined)
              this.port = opt.port;
          }


          mongoose.connect('mongodb://localhost:27017/blockchain');

          var conn = mongoose.connection;

          conn.on('error', console.error.bind(console, 'connection error:'));
          conn.once('open', function(){

              callback(null, 'connect to block')
          })

          var blockSchema = mongoose.Schema({
              header : Object,
              innerPolicy : Array,
              outperPolicy : Array,
              Transacitons: Array
          })

          this.blockModel = mongoose.model('block', blockSchema);

    }

    setBlock(data){

          const self = this;

          var block = new this.blockModel(data)

          console.log(block);

          block.save(function(err, block){
            if(err)
              return console.log('cannot write client');
          })

    }

    getBlockFromId(data ,callback){
      const self = this;

      var query = self.blockModel.findOne({ 'header.Id' : data.id});

      query.exec(function(err, block){
        if(err)
          return console.err('cannot read block')

          callback(err, block);
      })
    }


    //올림차순
    getBlockAllsorted(callback){
      const self = this;

      var query = self.blockModel.find().sort({ 'header.Id' : 1})

      query.exec(function(err, blocks){
        if(err)
          return console.err('cannot read blocks')

        callback(err, blocks);
      })
    }

    getBlockCount(callback){
      const self = this;

      self.blockModel.count().exec(function( err, count){
        callback(err, count);
      });
    }

    deleteBlockFromindexToEnd(data, callback){
      const self = this;

      this.getBlockCount(function(err ,count){

          for ( var i = data.id ; i <= count ; ++i){
            self.blockModel.deleteOne({ 'header.Id' : data.id }).exec();
           }

          callback(err , 'delete');
      })

    }

    setBlocks(blocks, callback){
      const self = this
      async.eachSeries(blocks, function (block, done) {
        self.setBlock(block, done)
      }, callback)
    }

}


/*
mongodb.prototype.getLaskBlock = function(data){

}



mongodb.prototype.getBlockFromId = function(data, callback){
    const self = this;

    var query = self.blockModel.findOne({ 'header.id' : data.id});

    query.exec(function(err, block){
      if(err)
        return console.err('cannot read block')

        callback(err, blcok);
    })
}

mongodb.prototype.getBlockFromHV = function(data, callback){
  const self = this;

  var query = self.blockModel.findOne({ 'header.BlockHV' : data.id});

  query.exec(function(err, block){
    if(err)
      return console.err('cannot read block')

      callback(err, blcok);
  })
}

mongodb.prototype.getBlcokAllSoted = function(callback){
  const self = this;

  var query = self.blockModel.find().sort({ 'heaer.id' : -1})

  query.exec(function(err, blocks){
    if(err)
      return console.err('cannot read blocks')

    callback(err, blocks);
  })
}

mongodb.prototype.delBlockFromHV = function(data, callback){

}
*/
module.exports = blockdb
