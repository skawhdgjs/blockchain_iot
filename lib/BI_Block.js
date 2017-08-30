const bh = require('./BI_BlkHeader')
const inp = require('./BI_innerPolicy')
const otp = require('./BI_outerPolicy')
const tx = require('./BI_Tx')
const crypto = require('crypto-js')
const Trie = require('merkle-tree-gen')
const async = require('async')
const _ = require('lodash')
const genesisParam = require('./genesis.json')


class Block{

  /***********************
    create block section

    usage : when create block
    call : new block()
    sequence:
    1.transaction
    2.innerPolicy
    3.outerPolicy
    4.header

  ***********************/
  constructor(data){
    const self = this

    this.innerPolicy = []
    this.outerPolicy = []
    this.Transactions = []

    this._inBlockchain = false
    this.txTrie ={}

    //dataTransaction put here
    if(Array.isArray(data.Transactions)){
        _.forEach(data.Transactions , function(tx){
           self.Transactions.push(tx)
        })
    }

    //innerpolicy, outerpolicy
    if(Array.isArray(data.innerPolicy) && Array.isArray(data.outerPolicy)){
      this.innerPolicy = data.innerPolicy;
      this.outerPolicy = data.outerPolicy;
    }

    var header = {
       id : data.id,
       MinerId : data.MinerId,
       NoT : data.Transactions.length,
       prvBlockHV : data.prvBlockHV
    }
    header.BlockHV  = crypto.SHA256(this.header + this.outerPolicy + this.innerPolicy + this.Transactions).toString();

    this.header = new bh(header);

    if(data.prvBlockHV !== "0"){
      self.genTxTrie(function(err, result){})
      this.header.txTrie = self.txTrie.root
    }
  }

  /*return block hash */
  hash(){
    return this.header.hash()
  }

  isGenesis(){
    return this.header.isGenesis()
  }


/***********************
 validate block section

 usage : check when need to validate block
 call : object.vaildate(blockchain, function(errors){})
 sequence :

 1.header check

 2.transaction trie check
 2.1 generateTxTrie
 2.2 validateTxTrie

 3. outerpolicy check

 4. innerpolicy check

************************/

  validate(blockchain, cb){
    const self = this
      var errors = []

      async.waterfall([

        //generate TransactionTrie
        function(cb){
              self.genTxTrie(cb)
        },

        self.header.validate(blockchain, cb)


      ],function(err){

        if(err){
          errors.push(err)
        }

        //1
        if(!self.validateTxTrie()){
          errors.push('invaild TxTire')
        }

        //2
        var txErrors = self.validateTransaction()
        if(txErrors !== ''){
          errors.push(txErrors)
        }

        //3
        var outErrors = self.outvalidate()
        if(outErrors !== ''){
          errors.push(outErrors)
        }

        //4
        var innErrors = self.innvalidate()
        if(innErrors !== ''){
          errors.push(innErrors)
        }

        console.log('validate complete')

        cb(self.arrayToString(errors))
      })
  }


  /**
   * Generate transaction trie. The tx trie must be generated before the transaction trie can
   * be validated with `validateTransactionTrie`
   * @method genTxTrie
   * @param {Function} cb the callback
   */
  genTxTrie(cb){
    const self = this
    Trie.fromArray({array : self.Transactions}, function(err, result){
      if(err)
        return cb('falid generate Transaction Tire')

      self.txTrie = result
    })
  }

  // 언제 header.transactionTrie 에 값이 들어가지?
  validateTxTrie(cb){
    const self = this



    var txT = self.header.txTrie.toString('hex')

    //console.log(txT)

    if(self.Transactions.length){
      return txT === self.txTrie.root.toString('hex')
    }else{
      return true
    }
  }

  validateTransaction(){
    const self = this

    var errors = []

    self.Transactions.forEach(function(tx, i){
       var error = self.txvalidate(tx)
       if(error){
         errors.push(error + ' at tx' + i)
       }
    })

    return self.arrayToString(errors)
  }

   txvalidate(tx){
      const errors = [];

      if(!(tx.txType == 1 || tx.txType == 2 || tx.txType ==3 || tx.txType == 4)){
          errors.push(['undefined txType ' + tx.txType])
      }

      return errors.join(' ')
   }

   outvalidate(outerPolicy){
     const self = this;
     const errors = [];

     self.outerPolicy.forEach(function(outp, i){
          if(outp.number == null || outp.devId == null || outp.txType == null || outp.trgORop == null || outp.action == null){
            errors.push('invalid outerpolicy ' + i)
          }
     })

     return self.arrayToString(errors)
   }

   innvalidate(innerPolicy){
     const self = this;
     const errors = []

     self.innerPolicy.forEach(function(innp, i){
       if(innp.number == null || innp.policyType == null || innp.action == null){
         errors.push('invalid innerpolicy'+i)
       }
     })

     return self.arrayToString(errors)
   }

   arrayToString(array) {
     try {
       return array.reduce(function (str, err) {
         if (str) {
           str += ' '
         }
         return str + err
       })
     } catch (e) {
       return ''
     }
   }
}




module.exports = Block;
/*
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
*/

//console.log(txdata1)
/*
var data = {
   id : '1',
   MinerId : '1',
   NoT : 0,
   prvBlockHV : '1',
   Transactions : [tx1, tx2],
   innerPolicy : [int1],
   outerPolicy : [out1]
}



var a = new Block(data)
*/
/*
a.genTxTrie(function(err, result){
    console.log(result.root)
})
a.validateTxTrie(function(err, result){

})

var c = a.validateTransaction()
console.log(c)
*/
/*
console.log(a)

var k = a.vaildate(null, function(errors){
  console.log(errors)
})
*/
