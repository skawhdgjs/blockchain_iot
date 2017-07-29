var ipdb = require('./lib/BI_mongo_ip')
var async = require('async')
var wait = require('wait.for')

var opt= {};
var ip;
/*
var ip = new ipdb(opt, function(result){
  console.log(result);
});
*/
//console.log(ip)

var client1 = {
  ip :'222.222.222.222',
  clientId : 'clientId1',
  shk : 'hello'
}

var client2 = {
  ip :'222.222.222.222',
  clientId : 'clientId2',
  shk : 'hello2'
}

function init(){
  console.log('cibla');
  ip = new ipdb(opt, function(result){
    console.log(result);
  });
}

wait.forMethod(init());

var ip ;
async.waterfall([
  function(cb){
    ip = new ipdb(opt, function(result){
      console.log(result);
      cb(null, 'hi');
    });

  },
  function(arg1, cb){
    console.log(arg1)
    ip.getShkFromCI({clientId : 'clientId1'}, function(err ,result){
      console.log(result);
      cb()
    })

  },
  function(cb){
    ip.getAllclient(function(err, result){
      console.log(result);
      cb()
    })

  }

],function(err ,result){
  console.log(result);
})
