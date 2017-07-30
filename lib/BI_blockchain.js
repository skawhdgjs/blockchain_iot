const async = require('async')
const block = require('./BI_Block')
const devicedb = require('./BI_mongo_device')
const blockdb = require('./BI_mongo_block')
const _ = require('lodash')
const genesisParam = require('./genesis.json')

class Blockchain{
  constructor(){
    const self = this;
     this.blockchain = [];

     var genblock = new block(genesisParam);
     //console.log(genblock)
     self.putBlock(genblock, function(err, result){
       //console.log(result);
     })


/*
     const blockdb_I = new blockdb(opt, function(err, result){
       if(err)
         console.error(new Error('block db initalize faile'))

       blockdb_I.getBlockAllsorted(function(err, devices{
           if(err)
             console.error(new Error('fail read all block'))

           blockdb_I.getBlockCount(function(err, result){
             if(result == 0 ){
               var genblock = new block(genesisParam);
               self.putBlock(genblock, function(err, result){
                 console.log(result);
               })

             }else{
               _.forEach(devices, function(value){
                   blockchain.push(value);
               })
             }

           })

       }))
     });
     */

  }


  getLastBlock(){
    return this.blockchain[this.blockchain.length-1]
  }

  addInner(data){
    const self = this;
    var blk = this.getLastBlock();
    blk.innerPolicy.push(data);
  }

  getInner(){
    const self = this;
    var blk = this.getLastBlock();
    return blk.innerPolicy;
  }

  deleteInner(number){
    const self = this;
    var blk = this.getLastBlock();
    _.remove(blk.innerPolicy, { number : number});
  }

  updateInner(number, action){
    const self = this;
    var blk = this.getLastBlock();
    var a = _.find(blk.innerPolicy, {number : number});
    a.action = action;
  }

  addOuter(data){
    const self = this;
    var blk = self.getLastBlock();
    blk.outperPolicy.push(data);
  }

  getOuter(){
    const self = this;
    var blk = self.getLastBlock();
    return blk.outperPolicy;
  }

  deleteOuter(number){
    const self = this;
    var blk = self.getLastBlock();
    return _.remove(blk.outperPolicy, { number : number});
  }

  updateOuter(number, action){
    const self = this;
    var blk = self.getLastBlock();
    var a = _.find(blk.outperPolicy, {number : number});
    a.action = action;
    return a;
  }


  putBlocks(blocks, cb){
     const self = this
     async.eachSeries(blocks, function (block, done){
       self.putBlock(block,done)
     }, cb)
  }

  putBlock(block,callback){
      const self = this;
      self.blockchain.push(block);
      //blockdb_I.setBlock(genblock);
      callback(null,'push genesisblock')
  }
}




module.exports = Blockchain;
