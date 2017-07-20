 var Transaction = require('./lib/BI_Tx')

 var rawTx = {
   id : '1',
   devId : '0101',
   txType : '3',
   //timestamp : new Date().toString,
   content : 'open',
   //sig : '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 };

 var tx = new Transaction(rawTx);

 console.log(tx)
