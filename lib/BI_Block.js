var bh = require('./BI_BlkHeader')
var inp = require('./BI_innerPolicy')
var otp = require('./BI_outerPolicy')
var crypto = require('crypto-js')

class Block{

  constructor(data){

    this.Transactions = [];


    if(data.Transactions != undefined){
        for(var i = 0 ; i  < data.Transactions.length ; ++i)
           this.Transactions.push(data.Transactions[i]);
    }


    var header = {
       id : data.id,
       MinerId : data.MinerId,
       NoT : data.Transactions.length,
       prvBlockHV : data.prvBlockHV
    }

    this.innerPolicy = data.innerPolicy;
    this.outperPolicy = data.outerPolicy;

    header.BlockHV  = crypto.SHA256(this.header + this.Transactions).toString();

    this.header = new bh(header);


    console.log(this);
  }

  updateHeader(data){

  }


}

var data = {
   id : '1',
   MinerId : '1',
   NoT : 0,
   prvBlockHV : '1',
   Transactions : [1,2],
   innerPolicy : [2,3],
   outerPolicy : [3,4]
}

var a = new Block(data)
