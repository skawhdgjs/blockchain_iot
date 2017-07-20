'use strict';


function Transaction(number, deviceId, transactionType, content, Sigiture){
  this.id = number;
  this.deviceId = deviceId;
  this.trasncationType = transactionType;
  this.timestamp = new Date();
  this.content = content;
  this.Sigiture = Sigiture;
}

module.exports = Transaction;
