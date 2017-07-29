var blockdb = require('./lib/BI_block_db_tmp')
var sleep = require('sleep');
var block = require('./lib/BI_Block')


var opt = {}
var blkdb = new blockdb(opt, function(err, result){
  console.log(result);

  var data1 = {
     id : '5',
     MinerId : '1',
     NoT : 0,
     prvBlockHV : '1',
     Transactions : [1,2],
     innerPolicy : [2,3],
     outerPolicy : [3,4]
  }

  var data2 = {
     id : '6',
     MinerId : '1',
     NoT : 0,
     prvBlockHV : '1',
     Transactions : [1,2],
     innerPolicy : [2,3],
     outerPolicy : [3,4]
  }

  var block1 = new block(data1);
  var block2 = new block(data2);
  blocks = [ block1, block2];

  console.log(blocks);
/*
  blkdb.setBlocks(blocks, function(err, result){
    console.log(result);
  })
*/
  //console.log(block1)

  //blkdb.setBlock(block1)
/*
  blkdb.getBlockAllsorted(function(err, result){
     console.log(result);
  })
*/
/*
  blkdb.deleteBlockFromindexToEnd({ id : '3'} , function(err, result){
    console.log(result);
  })
*/
})
