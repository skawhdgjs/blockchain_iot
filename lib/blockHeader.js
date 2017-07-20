var transaction = require('./transaction');


const bh = function (MinerID, NumOfTransaction, PreviousBlockHV, ThisBlockHV) {
  this.MinerID = MinerID;
  this.timestamp = new Date();
  this.NumOfTransaction = NumOfTransaction;
  this.PreviousBlockHV = PreviousBlockHV;
  this.ThisBlockHV = ThisBlockHV;
}

module.exports = bh;
