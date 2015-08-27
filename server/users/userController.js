var bcrypt = require('bcrypt-nodejs');
var User = require('./userModel');
var UtilityAPI = require('../utilityAPI/UtilityAPI');


var getUserUID = function(req, res, next){ 
  var username = req.cookies.username
  User.findOne({ 
    username: username
  }).exec(function(err, data){ 
    if(err) console.log('Error in getting user UID '+ err)
    else { 
      res.send(data.uid)
    }
  })
};

var checkUsernameAvail = function(req, res, cb){ 
  User.findOne({
    username: req.body.username
  }).exec(function(err,data){ 
    if(err) console.log('Error in user database query ' + err);
    if(data){ 
      console.log('Username already exists.');
      res.status(418).send();
    } else {
      cb(true)
    }
  });
};

var saveUser = function(obj, cb){ 
  bcrypt.hash(obj.password, 8, function(err, hash){ 
    var newUser = new User({ 
      username: obj.username, 
      password: hash,
      utilityAPIData: { 
        account_auth: obj.account_auth,
        uid: obj.uid, 
        bill_count: obj.bill_count, 
        utility: obj.utility, 
        utility_service_address: obj.utility_service_address
      }
    })

    newUser.save(function(err, result){ 
      if(err) console.log("Error saving user to database "+ err);
      else { 
        cb(true)
      }
    })
  })
};

var signup = function(req, res, cb){ 
  checkUsernameAvail(req, res, function(){ 
    console.log(req.body)

    var requestObj = { 
      utility: 'PG&E', 
      auth_type: 'owner',
      real_name: req.body.pgeFullName, 
      utility_username: req.body.pgeUsername,
      utility_password: req.body.pgePassword,
    }

    UtilityAPI.postNewUser(JSON.stringify(requestObj), function(status){ 
      console.log("Successfully added account to UtilityAPI.")
      console.log(status)

      UtilityAPI.getActiveUsers(function(accounts){ 
        var newUserObj = { 
          username: req.body.username, 
          password: req.body.password,
          utilityAPIData: { 
            account_auth: accounts[0].account_auth,
            uid: accounts[0].uid, 
            bill_count: accounts[0].bill_count, 
            utility: accounts[0].utility, 
            utility_service_address: accounts[0].utility_service_address
          }        
        } 

        saveUser(newUserObj, function(){ 
          console.log("User saved to database.")
        })
      });
    });
  });
};

module.exports = { 
  testfn: testfn, 
  signup: signup, 
  getUserUID: getUserUID
}

