var aes256 = require('aes256');
var crypto = require('asymmetric-crypto')
var trans = require('./lib/transaction')
var rdString = require('crypto-random-string');

const keyPair = crypto.keyPair();

var tr = new trans(1, 1, 3, 'thermometer : '+ ( (Math.random()*4)+26 ) +'°C',
        keyPair.publicKey);
console.log(tr);
console.log(JSON.stringify( tr ));

const shardKey = rdString(64);

var encrypted = aes256.encrypt(shardKey, JSON.stringify(tr));
console.log(encrypted);
var decrypted = aes256.decrypt(shardKey, encrypted);
console.log(decrypted);
