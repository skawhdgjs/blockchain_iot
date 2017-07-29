const async = require('async')
const block = require('./lib/BI_Block')

class Blockchain{
  construct(data){
     this.blockchain = [];
  }

  getLastBlock(){
    return this.blockchain[this.blockchain.length-1]
  }

  putBlocks(blocks, cb){
     const self = this
     async.eachSeries(blocks, function (block, done){
       self.putBlock(block,done)
     }, cb)
  }

  putBlock(block, cb, isGenesis){
    const self = this

    block = new Block(block)

  }
}

module.exports = Blockchain
