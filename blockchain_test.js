var blockchain = require('./lib/BI_blockchain')
var inner = require('./lib/BI_innerPolicy')
var outer = require('./lib/BI_outerPolicy')
var bc = new blockchain();

var outer1 = new outer({
  number : 1,
  reqId : 'door',
  txType : 'operation',
  opType : 1,
  action : 'allow'
})

var outer2 = new outer({
  number : 2,
  reqId : 'door',
  txType : 'operation',
  opType : 2,
  action : 'allow'
})
/*
var inner2 = new inner({
  number : 2,
  policyType : 'add',
  action: 'allow'
})
*/

//console.log(outer1)
bc.addOuter(outer1);
bc.addOuter(outer2)
console.log(bc.updateOuter(1,'deny'));
//console.log(inner2);
//bc.addInner(inner1);
//bc.addInner(inner2);
//bc.deleteInner(2)

//console.log(bc.)
