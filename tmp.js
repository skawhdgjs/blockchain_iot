// import network parameters for Bitcoin
var p2p = require('p2p');
var crypto = require('asymmetric-crypto')
var aes256 = require('aes256');
var express = require('express')
var _ = require('lodash');
var bodyParser = require('body-parser');
var http = require('http');
var rdString = require('crypto-random-string');

const keyPair = crypto.keyPair();

var peerList = [{
  host : '39.115.17.22',
  role : 'M',
  pk  : keyPair.publicKey
}];

var skList = [];

var peer = p2p.peer(
  {
    host : '39.115.17.22',
    port : 3000,
    serviceInterval: '30s'
    //wellKnownPeers: { host: 'localhost', port: 4000 }
  }
);

peer.on('status::*', status => {
  console.log(status);
});

peer.on('environment::successor', successor => {
  console.log("s : "+ successor.port);
  // ...
});

peer.on('environment::predecessor', predecessor => {
  // ...
  //console.log("p : "+ predecessor.port);
  console.log('predecssor');
});


peer.handle.genesis = (payload, done) => {
  console.log(payload.host);

  peer.wellKnownPeers.add({ host : payload.host , port :3000 });


  var secret = crypto.encrypt(rdString(64), payload.PK, keyPair.secretKey);
  console.log(secret.data);
  console.log(secret.nonce);

  done(null, {message : secret , PK : keyPair.publicKey, PeerList  : peerList});
  //done = {message : secret , PK : keyPair.publicKey};
  // or: done(null, result);
  peerList.push({host : payload.host , role : payload.Role , pk : payload.PK});
};

/**** update peer *****/
peer.handle.upPeer = (payload, done) =>{

}

function broadcast(handle, message){
    for ( var i in PeerList){
      peer.remote({host : i.host, port : 3000}).run(handle, message, (err, result) =>{
      })
    }
}

/**** http server *****/
const app = express();
//app.use(bodyParser.json());
app.get('/message', (req, res) => {

  peer.remote({host : '114.71.40.82' ,  port : 3000}).run('/handle/grant', { grant : 'ok'}, (err, result) => {

  });

  res.send("send /message");
});

app.get('/', function(req, res){
    res.send('Hello World');
});

http.createServer(app).listen(9999);
