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
    username: req.body.username.toLowerCase()
  }).exec(function(err,data){ 
    if(err) console.log('Error in username database query ' + err);
    if(data){ 
      console.log('Username already exists.');
      res.sendStatus(418);
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
    username: req.body.username.toLowerCase()
  }).exec(function(err, data){ 
    if(err) console.log("Error in querying User database.")
    else if(data === null){ 
       console.log('Username does not exist.' + err);
       res.sendStatus(418);
    } else { 
      bcrypt.compare(req.body.password, data.password, function(err, match){ 
        if(err) res.status(500).send();
        else if(!match){ 
          console.log("Incorrect password.");
          res.status(403).send();
        } else { 
          res.status(200).send({username: data.username, uid: data.utilityAPIData.uid});
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
      console.log(user)

    setTimeout(function(){
      UtilityAPI.getActiveUsers(function(accounts){ 
        for(var i=0; i<accounts.length; i++){
          var account = accounts[i]
          if(account.account_uid === user.uid){ 
            var newUserObj = { 
            username: req.body.username.toLowerCase(), 
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
          } else { 
            console.log("Registration failed")
            UtilityAPI.getDeleteCode(user.uid,function(code){ 
              UtilityAPI.postDeleteCode(user.uid, JSON.stringify(code), function(status){ 
                console.log("Successfully deleted account from UtilityAPI.")
                console.log(status)
                res.sendStatus(418)
              })
            })
            break;
          }
         }
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

