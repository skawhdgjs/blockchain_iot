// import network parameters for Bitcoin
var params = require('webcoin-bitcoin').net

// create peer group
var PeerGroup = require('bitcoin-net').PeerGroup
var peers = new PeerGroup(params)




peers.on('peer', (peer) => {
  console.log('connected to peer', peer.socket.remoteAddress)

  // send/receive messages
  peer.once('pong', () => console.log('received ping response'))
  peer.send('ping', {
    nonce: require('crypto').pseudoRandomBytes(8)
  })
  console.log('sent ping')
})

// create connections to peers
peers.connect()

// allow incoming connections from bitcoin-net peers
peers.accept((err) => {
  if (err) return console.error(err)
  console.log('accepting incoming connections')
})
