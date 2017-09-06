const transaction = require('./BI_Tx')
const express = require('express')
const app = express()
const _ = require('lodash')

const TxType = {
    operation : 1,
    access : 2,
    monitor : 3,
    remove : 4
}



class deviceI{
  constructor(){
      const self = this

      this.devId

      this.oplist = []

      self.addOp(1,1,'1')
      self.addOp(2,2,'2')

      self._initCommandServer()
  }

  _initCommandServer(){
    const self = this

    app.get('/', function(req, res){
       res.render('device.html', {oplist : self.oplist})
    })

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.use(express.static('public'));

    app.listen(3090, function(){
      console.log('[app][device] start')
    })
  }

  addOp(txType, trgORop, content){
    const self = this

     var op = {
       txType : txType,
       trgORop : trgORop,
       content : content
     }

     self.oplist.push(op)
  }


}

var device = new deviceI()
