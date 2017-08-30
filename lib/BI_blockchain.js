const async = require('async')
const Block = require('./BI_Block')
const devicedb = require('./BI_mongo_device')
const blockdb = require('./BI_mongo_block')
const _ = require('lodash')
const genesisParam = require('./genesis.json')
const semaphore = require('semaphore')

const bh = require('./BI_BlkHeader')
const inp = require('./BI_innerPolicy')
const otp = require('./BI_outerPolicy')
const tx = require('./BI_Tx')

class Blockchain{

  //block
  constructor(){
     const self = this;

     self.blockchain = [];
     self._putSemaphore = semaphore(1)

     self.blockdb ;
     //databse option
     var opt = {
        ip : 'localhost',
        port : 27017
     }


      //      var genblock = new Block(genesisParam)
        //   self.putBlock(genblock, function(err, result){})

     //block data from database
     self.blockdb_I = new blockdb(opt, function(err, result){
       if(err)
         console.error(new Error('block db initalize faile'))

       self.blockdb_I.getBlockAllsorted( function(err, blocks) {

           if(err)
             console.error(new Error('fail read all block'))

           //if made first
           if(blocks.length == 0 ){
              var genblock = new Block(genesisParam)
              self.blockchain.push(genblock)
              self.putBlock(genblock, function(err, result){
              }, true)
           }else{
              self.putBlocks(blocks)
           }

          })

       })


  }

  /****************************
  innerPolicy section

  ****************************/
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

  findInner(number){
    const self = this;
    var blk = this.getLastBlock();
    var a = _.find(blk.innerPolicy, {number : number});
    if(a != null || a != undefined){
      return a
    }else{
      return false;
    }
  }

  /****************************
  outerPolicy section

  ****************************/


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

  findOuter(devId, txType, trgORop){
    const self = this;
    var blk = this.getLastBlock();
    var a = _.find(blk.outerPolicy, {devId : devId, txType : txType, tagORop : tagORop});
    if(a != null || a != undefined){
      return a
    }else{
      return false;
    }
  }

  /***************************
  block section

  block

  1.putBlocks
  2.putBlock
  3._putBlock

  4.getBlocks
  5.getBlocks

  6.verify
  ****************************/


  getLastBlock(){
    return this.blockchain[this.blockchain.length-1]
  }



  /**
  *Add many blocks to the blockchain
  *@method putBlocks
  *@param {array} blocks
  *@param {function} cb
  */
  putBlocks(blocks, cb){
     const self = this
     async.eachSeries(blocks, function (block, done){
       self.putBlock(block,done)
     }, cb)
  }

  /**
  *Add block to the blockchain
  *@method putBlock
  *@param {object} block
  *@param {function} cb
  *@param {function} isGenesis
  */
  putBlock(block, cb, isGenesis){

      const self = this;

      console.log(self.blockchain)
      self._putBlock(block , cb, isGenesis)
/*
      lockUnlock(function (done){
        self._putBlock(block ,done, isGenesis)
      }, cb)

      // lock, call fn, unlock
      function lockUnlock (fn, cb) {
        // take lock
        self._putSemaphore.take(function () {
          // call fn
          fn(function () {
            // leave lock
            self._putSemaphore.leave()
            // exit
            cb.apply(null, arguments)
            //cb.apply(null, arguments)
          })
        })
      }
*/
  }

  _putBlock(block , cb, isGenesis){
      const self = this
      //verify
      //console.log('in now' + self.blockchain)
      if(!isGenesis){
          block.validate(self.blockchain, function(err, result){
            if(err)
              cb('invalid')

              //add
              block._inBlockchain = true
              self.blockchain.push(block)

              //push db
              self.blockdb_I.setBlock(block)
          })
      }else{
        //add
        block._inBlockchain = true
        self.blockchain.push(block)

        //push db
        self.blockdb_I.setBlock(block)
      }



      //cb(null, block)
  }

  getBlockDetail(BlockHV, cb){
    const self = this
    self.getBlock(BlockHV, function(err, result){
       if(err)
          cb(err, null)

       return cb(null, result.header)
    })
  }

    //find block by hash
    getBlock(BlockHV, cb){
        const self = this

        const block = _.find(self.blockchain, function(blk){
          return blk.header.BlockHV === BlockHV
        })

        if(block != undefined)
          return cb(null, block)
        else {
          return cb('cannot find any mathed block', null)
        }
    }

  makeGenesisBlock(){
    const self = this;
    var genesisBlock = new Block(genesisParam)
  }

  getParentHV(){
    const self = this
    var block = self.getLastBlock()
    return block.header.BlockHV
  }

  printBlockchain(){
    const self = this;

    _.forEach(self.blockchain, function(block){
      console.log(block)
    })
  }
}




module.exports = Blockchain;

/*
var blockchain1 = new Blockchain();


var outdata = {
  number : 1,
  devId : 'clinet1',
  txType : 1,
  trgORop : 1,
  action : 1
}

var out1 = new otp(outdata)
console.log(out1)


var intdata = {
    number : 1,
    policyType : 1,
    action : 1
}

var int1 = new inp(intdata)
console.log(int1)


var txdata1 = {
   devId : 'client1',
   txType : 1,
   trgORop : 1,
   content : 'testtx'
}

var txdata2 = {
   devId : 'client1',
   txType : 1,
   trgORop : 2,
   content : 'testtx'
}

var tx1 = new tx(txdata1)
var tx2 = new tx(txdata2)


//console.log(txdata1)

var data = {
   id : '1',
   MinerId : '1',
   NoT : 0,
   prvBlockHV : 'eb045d78d273107348b0300c01d29b7552d622abbc6faf81b3ec55359aa9950c',
   Transactions : [tx1, tx2],
   innerPolicy : [int1],
   outerPolicy : [out1]
}



var a = new Block(data)

blockchain1.putBlock(a, function(err, result){}, false)
var c = blockchain1.getParentHV()
console.log(c)
//blockchain1.printBlockchain()
*/
