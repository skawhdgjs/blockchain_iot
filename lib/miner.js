// import network parameters for Bitcoin
var p2p = require('p2p');
var crypto = require('asymmetric-crypto')
var aes256 = require('aes256');
var express = require('express')
var _ = require('lodash');
var bodyParser = require('body-parser');
var http = require('http');
var rdString = require('crypto-random-string');

var peerList = [];
var skList = [];

const Miner = {};

const keyPair = crypto.keyPair();

var block = [];

Miner.run = function(options){


  const peer = p2p.peer(
    {
      host : '39.115.16.174',
      port : options.p2p.port,
      serviceInterval: '30s'
    }
  );

  peerList.push({
     host : '39.115.16.174' ,
     port : options.p2p.port,
     role : 'M',
     pk : keyPair.publicKey
   })

  peer.on('status::*', status => {
    //console.log(status);
  });
  peer.on('environment::successor', successor => {
    //console.log("s : "+ successor.port);
  });
  peer.on('environment::predecessor', predecessor => {
    //console.log('predecssor');
  });


  peer.handle.genesis = (payload, done) => {

    const shardKey = rdString(64);

    peer.wellKnownPeers.add({ host : payload.host , port :3000 });
    var secret = crypto.encrypt(shardKey, payload.PK, keyPair.secretKey);


    done(null, {message : secret , PK : keyPair.publicKey, PeerList  : peerList});


    peerList.push({host : payload.host , role : payload.Role , pk : payload.PK});
    skList.push(shardKey);
  };

  peer.handle.SendTran = (payload, done) => {
      console.log(payload);
  }

  const app = express();
  //app.use(bodyParser.json());
  app.get('/message', (req, res) => {

  });

  http.createServer(app).listen(options.http.port);


}



module.exports = Miner;
