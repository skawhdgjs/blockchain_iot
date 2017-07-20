// import network parameters for Bitcoin
var p2p = require('p2p');
var crypto = require('asymmetric-crypto')
var aes256 = require('aes256');
var express = require('express')
var _ = require('lodash');
var bodyParser = require('body-parser');
var http = require('http');
var rdString = require('crypto-random-string');
var cron = require('node-cron');
var mBlock = require('./block');
var bh = require('./BlockHeader');
var db = require('./db');
var flaschenpost = require('flaschenpost')

var otPolicy = require('./outerPolicy');

var peerList = [];
var skList = [];
var poolTran = [];
var enPoolTran = [];

var otPolicyList = [];

const Miner = {};
const logger = flaschenpost.getLogger();

const userPair = crypto.keyPair();
const keyPair = crypto.keyPair();

const myId = 'Miner1';

var blockChain = [];


var getLastBlock =  () => blockChain[blockChain.length - 1];
var addBlock = (newBlock) => {
    //isvaildBlock
    blockChain.push(newBlock);
};

var mongo = new db('localhost',27017);


var makeOuterPolicy = () => {

  var otp1 = new otPolicy(0, 'D1' , 4, null, 0);
//  console.log(otp1);
  otPolicyList.push(otp1);
  var otp2 = new otPolicy(1, 'D2' , 4, null, 1);
//  console.log(otp2);
  otPolicyList.push(otp2);
  var otp3 = new otPolicy(0, 'D1' , 3, null, 0);
  otPolicyList.push(otp3);

  var otp4 = new otPolicy(1, 'D2' , 3, null, 1);
//  console.log(otp2);
  otPolicyList.push(otp4);
}

var makeGenesisBlock = () => {
    makeOuterPolicy();
    var newBlock = new mBlock(1,myId,0,'0',[],otPolicyList,[],keyPair.publicKey , keyPair.secretKey);
    addBlock(newBlock);
    mongo.create(newBlock);

    logger.info('makeGenesisBlock',newBlock)
}

var readBlockAll = () => {
    var block = mongo.findAll();
    console.log(block);
      _.forEach(block, function(value){
        //console.log('11111111111111');
        //console.log('value',value);
        blockChain.push(vaule);
    })
}

var checkBlockVaild = (loc) =>{

    for( i = loc ; i < blockChain.length-1; i++){
        if(blockChain[i].Header.ThisBlockHV != blockChain[i+1].Header.PreviousBlockHV){
          return false;
        }
    }
    return true;
}


Miner.run = function(options){

  logger.info('p2p start');

  const peer = p2p.peer(
    {
      host : '39.115.16.77',
      port : options.p2p.port,
      serviceInterval: '30s'
    }
  );

  peerList.push({
     host : '39.115.16.77' ,
     port : options.p2p.port,
     role : 'M',
     pk : keyPair.publicKey
   })

  peer.on('status::*', status => {
    console.log('stat');
  });
  peer.on('environment::successor', successor => {
    console.log('suc');
  });
  peer.on('environment::predecessor', predecessor => {
    console.log('pred');
  });


  peer.handle.genesis = (ip, payload, done) => {


    const shardKey = rdString(64);

    peer.wellKnownPeers.add({ host : payload.host , port :3000 });
    var secret = crypto.encrypt(shardKey, payload.PK, keyPair.secretKey);


    done(null, {message : secret , PK : keyPair.publicKey, PeerList  : peerList});


    peerList.push({host : payload.host , role : payload.Role , pk : payload.PK});
    skList.push(shardKey);
  };

  peer.handle.SendTran = (ip, payload, done) => {
      logger.info('Recive Transaction', ip, payload)

      var num = 0;

      for(var i = 1  ; i < peerList.length ; i++){

          if(peerList[i].host == ip){
              num = i;
              break;
            }
      }


      var decrypted = aes256.decrypt(skList[num-1], payload.transaction);

      var toObj = JSON.parse(decrypted);
      console.log(toObj);


      //grant
      var blk = getLastBlock();

      _.forEach(blk.OuterPolicyList, function(value){
           if((value.requester == toObj.deviceId) && (value.requesterfor == toObj.trasncationType)){
                   if(value.action == 0){
                       console.log('send grant')
                       done(null, {grant : aes256.encrypt(skList[num-1],'allow')});
                   }else{
                      console.log('send deny')
                      done(null, {grant : aes256.encrypt(skList[num-1],'deny')});
                   }

           }
      })
      //

      poolTran.push(toObj);
  }

  peer.handle.grant = (payload, done) => {



  }


  const app = express();
  //app.use(bodyParser.json());
  app.get('/message', (req, res) => {

  });

  //genesisblock
  makeGenesisBlock();


  http.createServer(app).listen(options.http.port);


  //readBlockAll();


  cron.schedule('*/30 * * * * *', function(){
      logger.info("make block & chain");

      _.forEach(poolTran, function(value){
         var dt = crypto.encrypt(value, userPair.publicKey, keyPair.secretKey);
         enPoolTran.push(dt.data);
      })

      //var k = crypto.encrypt(poolTran, userPair.publicKey, keyPair.secretKey);
      //var k2 = crypto.decrypt(k.data, k.nonce, keyPair.publicKey, userPair.secretKey);
      //var k3 = crypto.decrypt(k.data, k.nonce, keyPair2.publicKey, userPair.secretKey);
      logger.info('trasnaction encrypt', enPoolTran);
      //console.log(k2);

      var lblk = getLastBlock();
      var block = new mBlock(lblk.id + 1 , myId , enPoolTran.length , lblk.Header.ThisBlockHV , [] , otPolicyList ,enPoolTran, userPair.publicKey, keyPair.secretKey);
      //console.log(block);


      addBlock(block);
      mongo.create(block);
      //console.log('blockchain\n' + blockChain);
      checkBlockVaild(0);
      //make poolTran empty;
      poolTran = [];
      enPoolTran = [];
  });

}



module.exports = Miner;
