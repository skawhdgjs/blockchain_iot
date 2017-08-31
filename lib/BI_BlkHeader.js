

class BlkHeader {

  constructor(data){
    this.Id = data.id;
    this.MinerId = data.MinerId;
    this.time = Date.now();
    this.NumOfTransaction = data.NoT;
    this.prvBlockHV = data.prvBlockHV;
    this.BlockHV = data.BlockHV;
    this.txTrie = '';
  }


  hash(){
    return this.BlockHV
  }

  //prvBlockHV is null
  isGenesis(){
    return this.prvBlockHV  === "0"
  }

  validate(blockchain, cb){
    console.log("header validate")
    const self = this

    //if genesis Block no need to validate
    if(self.isGenesis()){
      return cb()
    }

    //find parent block
    //1. create_time check
    //2. seq_id check
    //console.log(blockchain)


    var parent = blockchain.forEach(function(v){
       //console.log(v)
       if(v.header.BlockHV === self.prvBlockHV){
          //console.log(v)
          return v
       }
    })

    //console.log(parent)
    if(parent === undefined){
      return cb('could not find parent block')
    }else{
      if(self.time <= parentBlock.header.time){
        return cb('invalid timestamp')
      }

      if(self.id <= parentBlock.header.id){
        return cb('invalid id')
      }

      return cb()
    }
/*
    blockchain.getBlock(self.prvBlockHV, function(err, parentBlock){
       if(err)
          return cb('could not find parent block')

       if(self.time <= parentBlock.header.time){
         return cb('invalid timestamp')
       }

       if(self.id <= parentBlock.header.id){
         return cb('invalid id')
       }

       return cb()
    })
*/
  }

}


module.exports = BlkHeader;
