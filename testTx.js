 var Transaction = require('./lib/BI_Tx')
 var CD = require('./lib/BI_symmetricCD');
 var CDI;

 var rawTx = {
    devId : 1,
    txType : 1,
    opType : 0,
    content : 'abc'
 };

 var tx = new Transaction(rawTx);
 var CDI = new CD('hi');

 console.log(CDI.cipher(tx.ser()));

var a = CDI.cipher(tx.ser());

 console.log(CDI.decipher(a));

var b= CDI.decipher(a);

console.log(tx.parse(b));

 //console.log(CDI.decipher(CDI.cipher(tx.ser())));
