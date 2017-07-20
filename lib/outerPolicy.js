var outer = function(number, requester, requestfor, targetID, action) {
   this.number = number;
   this.requester = requester;
   this.requesterfor = requestfor;
   this.targetID = targetID;
   this.action = action;
}

outer.prototype.Update = function(action) {
  if(action == 0)
  {

  }
}

module.exports = outer;
