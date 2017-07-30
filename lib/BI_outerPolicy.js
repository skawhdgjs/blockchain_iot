

class outerPolicy {
  constructor(data){
    this.number = data.number;
    this.reqId = data.reqId
    this.txType = data.txType;
    if(data.opType != undefined)
      this.opType = data.opType;

    if(data.targetId != undefined)
      this.targetId = data.targetId;

    this.action = data.action;
  }

}

module.exports = outerPolicy
