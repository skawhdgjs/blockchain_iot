'use strict'

const Util = require('ethereumjs-util')
const BN = Util.BN;

class Transaction{
  constructor(data){
     data = data || {}

     const fields =[{
         name : 'id',
         length : 32,
         allowLess : true,
         default : new Buffer([])
       }, {
         name : 'devId',
         length : 32,
         allowLess : true,
         default : new Buffer([])
       }, {
         name : 'txType',
         length : 10,
         allowLess : true,
         default : new Buffer([])
       },{
         name : 'timestamp',
         length : 32,
         allowLess : true,
         default : new Buffer([])
       },{
         name : 'content',
         length : 32,
         allowLess : true,
         default : new Buffer([])
       },{
         name : 'sig',
         length : 32,
         allowLess : true,
         allowZero : true,
         default : new Buffer([])
       }]


     //Seralize
     Util.defineProperties(this, fields, data)

/*
     Object.defineProperty(this, 'from', {
        enumerable: true,
        configurable: true,
        get: this.getSenderAddress.bind(this)
     })
     */
   }

     toCreationAddress () {
      return this.to.toString('hex') === ''
      }

     hash(includeSignature){
       if (includeSignature === undefined) includeSignature = true

       let items
       if (includeSignature) {
          items = this.raw
       } else {
            if (this._chainId > 0) {
          const raw = this.raw.slice()
          this.v = this._chainId
          this.r = 0
          this.s = 0
          items = this.raw
          this.raw = raw
            } else {
          items = this.raw.slice(0, 6)
          }
        }

        // create hash
        return Util.rlphash(items)
     }

     //

}

module.exports = Transaction
