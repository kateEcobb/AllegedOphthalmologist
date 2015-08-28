var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({ 
  username: { 
    type: String, 
    unique: true
  }, 
  password: String,
  utilityAPIData: { 
    account_auth: String,
    uid: String, 
    bill_count: Number, 
    utility: String, 
    utility_service_address: String
  }   
});


var User = mongoose.model('User', userSchema);

module.exports = User;