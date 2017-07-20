var sha256 = require('sha256');
var transaction = require('./transaction');
var bh = require('./BlockHeader');
var crypto = require('asymmetric-crypto')

const bl = function (id, MinerID, NumOfTransaction, PreviousBlockHV,
  InnerPolicy, OuterPolicyList, Transactionlist, publicKey, secretKey) {

  var head = JSON.stringify(new bh(MinerID, NumOfTransaction, PreviousBlockHV,
    sha256(id + MinerID + NumOfTransaction + PreviousBlockHV + InnerPolicy + OuterPolicyList
    + Transactionlist + publicKey)));

  this.id = id;
  this.Header = head
  this.InnerPloicy = InnerPolicy;
  this.OuterPolicyList = OuterPolicyList;
  this.Transactionlist = Transactionlist;
  this.MinerPK = publicKey;
  this.Signiture = crypto.sign(this.id + this.Header + this.InnerPolicy
    + this.OuterPolicyList + this.Transactionlist + this.MinerPK, secretKey);
}


bl.prototype.getId = function() {
  return this.id;
}

module.exports = bl;
