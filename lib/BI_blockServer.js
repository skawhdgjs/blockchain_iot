const blockchain = require('./BI_blockchain')
const transaction = require('./BI_Tx')
//const emit = require('event').EventEmitter()
const _ = require('lodash')
const express = require('express')
const app = express()

const bh = require('./BI_BlkHeader')
const inp = require('./BI_innerPolicy')
const otp = require('./BI_outerPolicy')
const Block = require('./BI_Block')

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
    const self = this;

    this.bcManage = new blockchain();

    this.pool = [];
    this.innerPolicy = [];
    this.outerPolicy = [];

    self._initCommandServer()
  }


  //받는부분
  //받아서 -> parsing -> handleTx 호출
  _initCommandServer(){
    const self = this;

    app.get('/', function(req, res){
      console.log('[app] request path  : / ')

      var lastblock = self.bcManage.getLastBlock()

      res.render('index.html', {block : lastblock})
    })

    app.get('/test', function(req,res){
      console.log('[app] request path  : /test ')

      var txdata1 = {
         devId : 'client1',
         txType : 1,
         trgORop : 1,
         content : 'testtx'
      }

      var tx1 = new transaction(txdata1)
      self.handleTx(tx1, function(err, result){

         if(err)
          res.send(err)

         res.send(result)

      })
    })

    app.get('/makeblock', function(req,res){
      console.log('[app] request path  : /makeblock ')

      var outdata = {
      number : 1,
      devId : 'client1',
      txType : 1,
      trgORop : 1,
      action : 1
    }

    var out1 = new otp(outdata)


    var intdata = {
        number : 1,
        policyType : 1,
        action : 1
    }

    var int1 = new inp(intdata)

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

    var tx1 = new transaction(txdata1)
    var tx2 = new transaction(txdata2)

    var parentBlockHV = self.bcManage.getParentHV()
    var Id = self.bcManage.getValidId()

    var data = {
      id : Id,
      MinerId : '1',
      NoT : 2,
      prvBlockHV : parentBlockHV,
      Transactions : [tx1, tx2],
      innerPolicy : [int1],
      outerPolicy : [out1]
    }

     var newBlock = new Block(data)

     console.log('[app][/makeblock] blockinfo : '  + newBlock.header.Id)

     self.bcManage.putBlock(newBlock , function(err, result){}, false)


      res.send('<h1>header</h1>')
    })

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.use(express.static('public'));

    app.listen(3080, function(){
      console.log('[app] start')
    })

  }


  //transcation controller
  //Tx : transaction
  //brodcast also use handleTx
  handleTx(Tx, cb){
    const self = this;


    const verift_outer = self.bcManage.findOuter(Tx.devId, Tx.txType, Tx.trgORop)

    //다른 blockserver에 brodcast
    console.log(verift_outer.action + " : "+ actionType.allow)
    //tx없을때
    if(verift_outer.action == actionType.allow){
      //결과를 포함하고 풀에 넣는다.
      _.assignIn(Tx , {result : 'ok'})
      self.pool.push(Tx);

      cb(null, 'push ok')
    }else{
      cb('notfind')
    }
    //broadcast
    /* emit */
  }


}

Blockserver = new BlockServer()
