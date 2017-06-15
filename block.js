
var CryptoJS = require("crypto-js");
var express = require("express");
var os = require("os");

var p2p = process.env.P2P_PORT || 6001;


var sockets = [];
var pk = [];

var transaction_pool = [];
var blockchain = [];

var ip;

var m;

var count = 0 ;

class block {
  constructor(previousHash, innerPolicy, outerPolicy, trasnactions, hash){
      this.previousHash = previousHash.toString()
      this.innerPolicy = innerPolicy
      this.outerPolicy = outerPolicy
      this.trasnactions = trasnactions
      this.hash = hash.toString()
  }
}

class trasnaction{
  constructor(number, deviceID, trasncationType, Sigiture){
    this.number = number;
    this.devicID = deviceID;
    this.trasncationType = trasncationType;
    this.Sigiture = Sigiture;
    console.log(number + " " + deviceID + " " + trasncationType + " " + Sigiture)
  }
}


var trasncationType = {
  M_Genesis : 0,
  Genesis : 1,
  Access : 2,
  Monitor : 3,
  Operation : 4,
  Remove : 5
};


var calculateHashForBlock = (block) => {
    return calculateHash(block.previousHash, block.innerPolicy, block.outerPolicy, block.trasnactions);
};

var calculateHash = (previousHash, innerPolicy, outerPolicy, trasnactions) => {
    return CryptoJS.SHA256(i).toString(previousHash + innerPolicy + outerPolicy + trasnactions);
};

var initP2PServer = () => {
    var server = new WebSocket.Server({port: p2p_port});
    server.on('connection', ws => initConnection(ws));
    console.log('listening websocket p2p port on: ' + p2p_port);
};

var connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        var ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log('connection failed')
        });
    });
};

var connectToPeersTest = () => {

  /*  newPeers.forEach((peer) => {
        var ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log('connection failed')
        });
    });
    */
};


var initConnection = (ws) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    //write(ws, queryChainLengthMsg());
    //genesis Transcation

    deviceID = Math.floor(Math.random() * pow(10, 5));



    Transcation(0 , 0, trasncationType.Genesis , Sigiture);
};

var deviceIDTest = () => {
   deviceID = Math.floor(Math.random() * 100000);

   console.log(deviceID);
   console.log(p2p);

   var ip = require("ip").address();
   console.log(ip)
   new trasnaction(count++ , deviceID, trasncationType.Genesis , "aa");

}


var initMessageHandler = (ws) => {
    ws.on('message', (data) => {
        var message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockchainResponse(message);
                break;
        }
    });
};

var initErrorHandler = (ws) => {
    var closeConnection = (ws) => {
        console.log('connection failed to peer: ' + ws.url);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

var write = (ws, message) => ws.send(JSON.stringify(message));
var broadcast = (message) => sockets.forEach(socket => write(socket, message));
var queryChainLengthMsg = () => ({'type': trasncationType.Genesis});

//connectToPeers(initialPeers);
//connectToPeersTest();
deviceIDTest()
