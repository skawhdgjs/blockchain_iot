var inner  = function(number, PolicyType, Action){
    this.number = number;
    this.PolicyType = PolicyType;
    this.Action = Action;
}


inner.prototype.update = function(Action){
  this.Action = Action;
}

module.exports = inner
