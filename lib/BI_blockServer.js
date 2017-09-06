const blockchain = require('./BI_blockchain')
const transaction = require('./BI_Tx')
const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const emitter = new Emitter();
const _ = require('lodash')
const express = require('express')
const app = express()
const cron = require('node-cron')

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

const catagory = {
   innerPolicy : 1,
   outerPolicy : 2
}

const pol_command = {
  add : 1,
  delete : 2
}

class BlockServer{

  constructor(){
    const self = this;

    this.bcManage = new blockchain();
    this.MinerId = "1"
    this.pool = [];
    this.innerPolicy = [];
    this.outerPolicy = [];
    this.posCount = 0;
    this.negCount = 0;
    this.minerCount = 10

    self._initPolicy()
    self._initCommandServer()
    self._initPoolserver()
    self._initEmmiter()

  }

  _initEmmiter(){
    const self = this

    emitter.on('command', function(result){
       console.log('send tx to device')
    })

    emitter.on('agreement',function(valid){
      if(valid == 'ok'){
        self.posCount++
      }else{
        self.negCount++
      }

      if(self.posCount + self.negCount == minerCount){
        emitter.emit('command')
        self.posCount = 0
        self.negCount = 0
      }

    })

    console.log('[blockserver] initEmitter compelete')
  }

  _initPolicy(){
     const self = this
     var block = self.bcManage

     _.forEach(block.innerPolicy, function(inn){
       self.innerPolicy.push(inn)
     })

     _.forEach(block.outerPolicy, function(out){
       self.outerPolicy.push(out)
     })

     console.log('[blockServer] initPolicy compelete')
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

    app.get('/delete', function(req, res){
      self.bcManage.deleteBlocks(5)
    })

    app.get('/verify', function(req, res){
      self.bcManage.hash_verify()
      res.send('<h1>verify </h1>')
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
       content : 'testtdddx'
    }

    var txdata2 = {
       devId : 'client1',
       txType : 1,
       trgORop : 2,
       content : 'testtxxcxcxxdkfjdkfjdlkfjdl'
    }

    var tx1 = new transaction(txdata1)
    var tx2 = new transaction(txdata2)

    var parentBlockHV = self.bcManage.getParentHV()
    var Id = self.bcManage.getValidId()

    var data = {
      id : Id,
      MinerId : self.MinerId,
      NoT : 2,
      prvBlockHV : parentBlockHV,
      Transactions : [tx1, tx2],
      innerPolicy : [int1],
      outerPolicy : [out1]
    }

     var newBlock = new Block(data)

     console.log('[app][/makeblock] blockinfo : '  + newBlock.header.BlockHV)

     self.bcManage.putBlock(newBlock , function(err, result){})


      res.send('<h1>header</h1>')
    })

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.use(express.static('public'));

    app.listen(3090, function(){
      console.log('[app] start')
    })

    console.log('[blockServer] ininCommandserver compelete')
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

      self.testhandler()

      cb(null, 'push ok')
    }else{

      _.assignIn(Tx , {result : 'deny'})
      self.pool.push(Tx);

      self.testhandler()

      cb('notfind')
    }
    //broadcast
    /* emit */

  }

  //가정한다
  //Txhandler 에서 boradcast 하고 그에대한 답이 왔을때의 상황
  testhandler(){
      const self = this

      emitter.emit('agreement', 'ok')
  }

  makeBlock(){
    const self = this

    console.log('[blockServer][makeBlock] make block')
    console.log('[blockServer][makeBlock] pool size : ' + self.pool.length)
    var encryptTx = [] ;
    _.forEach(self.pool, function(tx){
       encryptTx.push(tx)
    })

    self.pool = []

    var parentBlockHV = self.bcManage.getParentHV()
    var Id = self.bcManage.getValidId()
    var NoT = encryptTx.length

    var data = {
       id : Id,
       MinerId : self.MinerId,
       NoT : NoT,
       prvBlockHV : parentBlockHV,
       Transactions : encryptTx,
       innerPolicy : self.innerPolicy,
       outerPolicy : self.outerPolicy
    }

    var newBlock = new Block(data)
    self.bcManage.putBlock(newBlock , function(err, result){})

    console.log('[blockServer][makeBlock] compelete make block')
  }

  _initPoolserver(){
    const self = this

    //cron.schedule('*/10 * * * * *', function(){
    //   console.log('[blockServer][cron] make block on sechedule')
    //  self.makeBlock()
    //});

    console.log('[blockServer] initPoolServer complete')
  }

  deleteBlock(id){
      const self = this

      self.bcManage.deleteBlocks(id)
  }

  //update 하면 바로 make block 실행
  updatePolicy(cat, command, data){

      if(cat == catagory.innerPolicy){
          if(command == pol_command.add){
            var inner = new inp(data)
            innerPolicy.push(inner)
          }
      }else if( cat == catagory.outerPolicy){
          if(command == pol_command.add){
            var outer = new otp(data)
            outerPolicy.push(outer)

          }
      }
  }

}

Blockserver = new BlockServer()
