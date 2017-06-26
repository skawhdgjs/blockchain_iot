const miner = require('./lib/miner');

miner.run({
  http: {
    port: 9999
  },
  p2p: {
    port: 3000
  },
});
