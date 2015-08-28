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
  bcrypt.hash(obj.password, null, null, function(err, hash){ 
    var newUser = new User({ 
      username: obj.username, 
      password: hash,
      utilityAPIData: { 
        account_auth: obj.utilityAPIData.account_auth,
        uid: obj.utilityAPIData.uid, 
        bill_count: obj.utilityAPIData.bill_count, 
        utility: obj.utilityAPIData.utility, 
        utility_service_address: obj.utilityAPIData.utility_service_address
      }
    })

    newUser.save(function(err, result){ 
      if(err) console.log("Error saving user to database "+ err);
      else { 
        cb(true);
      }
    })
  })
};

var signin = function(req, res){ 
  User.findOne({ 
    username: req.body.username
  }).exec(function(err, data){ 
    if(err) { 
      console.log('Username does not exist.' + err);
      res.status(418).send();
    } else { 
      bcrypt.compare(req.body.password, data.password, function(err, match){ 
        if(err) res.status(500).send();
        else if(!match){ 
          console.log("Incorrect password.");
          res.status(404).send();
        } else { 
          res.status(200).send(data);
        }
      })
    }
  })
};

var signup = function(req, res){ 
  checkUsernameAvail(req, res, function(){ 
    console.log(req.body)

    var requestObj = { 
      utility: 'PG&E', 
      auth_type: 'owner',
      real_name: req.body.pgeFullName, 
      utility_username: req.body.pgeUsername,
      utility_password: req.body.pgePassword,
    }

    UtilityAPI.postNewUser(JSON.stringify(requestObj), function(user){ 
      console.log("Successfully added account to UtilityAPI.")

      //db query meterreadings.findOne({user_uid = })
    setTimeout(function(){
      UtilityAPI.getActiveUsers(function(accounts){ 
        accounts.forEach(function(account){ 

          if(account.account_uid === user.uid){ 
            var newUserObj = { 
            username: req.body.username, 
            password: req.body.password,
            utilityAPIData: { 
              account_auth: account.account_auth,
              uid: account.uid, 
              bill_count: account.bill_count, 
              utility: account.utility, 
              utility_service_address: account.utility_service_address
             }        
            }
          saveUser(newUserObj, function(){ 
            console.log("User saved to database.")
            res.send({username: newUserObj.username, uid: newUserObj.utilityAPIData.uid});
          })
             
           }
         })
      });
    },5000); //ask HIR about this
    });
  });
};

module.exports = { 
  signup: signup, 
  getUserUID: getUserUID, 
  signin: signin
}

