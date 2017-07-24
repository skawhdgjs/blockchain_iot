

class BlkHeader {

  constructor(data){
    this.Id = data.id;
    this.MinerId = data.MinerId;
    this.time = Date.now();
    this.NumOfTransaction = data.NoT;
    this.prvBlockHV = data.prvBlockHV;
    this.BlockHV = data.BlockHV;
  }



}


module.exports = BlkHeader;
