'use strict';


function Transaction(){
  this.id ;
  this.deviceId ;
  this.trasncationType ;
  this.timestamp ;
  this.content ;
}

Transaction.read2 = functin(){
  console.log(2);
}

Transaction.prototype.read = function(){
  console.log(1);
  return 0;
};

Transaction.prototype.create = function(number, devcieId, tranType, content){
  this.id = number;
  this.deviceId = deviceId;
  this.trasncationType = transactionType;
  this.timestamp = new Date();
  this.content = content;
}

var cc = new Transaction();
cc.read();

module.exports = Transaction;
