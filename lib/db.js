var mongoose = require('mongoose');
var flaschenpost = require('flaschenpost')
const logger = flaschenpost.getLogger();

var BlockSchema;


var mongodb = function(ip, port){
   this.ip = ip;
   this.port = port;

   if(!port)
    this.port = 27017;

   mongoose.connect('mongodb://localhost:27017/block');
   var db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function callback () {
 	    logger.info("mongo db connection");
   });

   var blockSchema = mongoose.Schema({
      id : 'Number',
      Header : 'String',
      InnerPolicy : [{numbe : 'Number' , PolicyType : 'String', Action : 'String'}],
      OuterPolicyList : [{number : 'Number' , requester : 'String', requesterfor : 'String', targetID : 'String', action : 'String'}],
      TransactionsList : [{id : 'Number', deviceId : 'String', transactionType : 'String', timestamp : 'Date', content : 'String', Sigiture : 'String'}],
      MinerPK : 'String',
      Signiture : 'String'
   });

   BlockSchema = mongoose.model('BlockSchema', blockSchema);

}

mongodb.prototype.create = function(Block){

  var blk = new BlockSchema(Block);

  blk.save( function(err, blk) {
    if(!err)
      logger.info('block write db');
  })
}

mongodb.prototype.findAll = function(){
  var blocks = 1;
  BlockSchema.find(function(error, Blocks){
      console.log('--- Read all ---');
      if(error){
          console.log(error);
      }else{
          //console.log(Blocks)
          blocks = Blocks;
      }
  }).sort({ id : 1});
  console.log(blocks);
  return blocks;
}

mongodb.prototype.findOne = function(id){
  BlockSchema.findOne({id : id}, function(error,Block){
      console.log('--- Read one ---');
      if(error){
          console.log(error);
      }else{
          console.log(Block);
      }
  })
}

mongodb.prototype.remove = function(id){
  BlockSchema.remove({id : id}, function(error,output){
      console.log('--- Delete ---');
      if(error){
          console.log(error);
      }
      console.log('--- deleted ---');
  });

}

mongodb.prototype.update = function(Block){
  BlockSchema.findOne({id : Block.id}, function(error,Block){
      console.log('--- Update(PUT) ---');
      if(error){
          console.log(error);
      }else{
          BlockSchema.save(function(error,modified_Block){
              if(error){
                  console.log(error);
              }else{
                  console.log(modified_Block);
              }
          });
      }
  });
}


module.exports = mongodb;
