var crypto = require('asymmetric-crypto');
var transaction = require('./transaction');

const bl = function (id, Header, InnerPolicy, OuterPolicyList, Transactionlist, UserPK, prevHash) {


  this.id = id;
  this.Header = Header;
  this.InnerPloicy = InnerPolicy;
  this.OuterPolicyList = OuterPolicyList;
  this.prevHash = prevHash
}

//header Hash256
function cryptoHash(){

}

//write db
function mongo(){

}


//work of proof


//


bl.prototype.getId = function() {
  return this.id;
}

module.exports = bl;
