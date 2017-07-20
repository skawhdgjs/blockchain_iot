const miner = require('./lib/miner');

miner.run({
  http: {
    port: 9997
  },
  p2p: {
    port: 3000
  },
  metadata : {
    idn : 1
  }
});
