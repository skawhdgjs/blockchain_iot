const blockchain = require('./BI_blockchain')
const transaction = require('./BI_Tx')
//const emit = require('event').EventEmitter()
const _ = require('lodash')



const TxType = {
    operation : 1,
    access : 2,
    monitor : 3,
    remove : 4
}

const actionType ={
    allow : 1,
    deny : 2
}

class BlockServer{

  constructor(){
    var bcManage = new blockchain();

    this.pool = [];
    this.innerPolicy = [];
    this.outerPolicy = [];

    bcManage.printBlockchain()
  }

  //받는부분
  //받아서 -> parsing -> handleTx 호출


  //transcation controller
  //Tx : transaction
  //brodcast also use handleTx
  handleTx(Tx, callback){
    const self = this;


    const verift_outer = bcManage.findOuter(Tx.devId, Tx.txType, Tx.trgORop)

    //다른 blockserver에 brodcast

    //tx없을때
    if(verift_outer.action == actionType.allow){

    }else{

    }


    //broadcast
    /* emit */


    //결과를 포함하고 풀에 넣는다.
    _.assignIn(Tx , {result : result})
    self.pool.push(Tx);
  }


}

Blockserver = new BlockServer()
