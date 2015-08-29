var bcrypt = require('bcrypt-nodejs');
var User = require('./userModel');
var UtilityAPI = require('../utilityAPI/UtilityAPI');

// getUserUID returns a user's unique UID from the database. 
var getUserUID = function(req, res, next){ 
  User.findOne({ 
    username: req.body.username.toLowerCase()
  }).exec(function(err, data){ 
    if (err) { 
      console.log('Error in getting user UID '+ err);
      res.status(500).send("Error in getting user UID from database.");
    } else if (!data){ 
      console.log("Error in username database query");
      res.status(500).send("Error in username database query");
    } else { 
      res.status(200).send(data.uid);
    }
  });
};

/* checkUsernameAvail checks to see if the username exists in the 
 * database already. If the username exists, server responds with a 418. 
 * Otherwise, the callback executes. 
 */
var checkUsernameAvail = function(req, res, cb){ 
  User.findOne({
    username: req.body.username.toLowerCase()
  }).exec(function(err,data){ 
    if(err){ 
      console.log('Error in username database query ' + err);
      res.status(500).send("Error in username database query");
    } else if (data){ 
      console.log('Username already exists.');
      res.status(418).send("Username already exists.");
    } else {
      cb(true);
    }
  });
};

/* saveUser saves the user to the database with both UtilityAPI data
 * and their custom username + password. If the save is successful, 
 * the callback executes. 
 */
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
    });

    newUser.save(function(err, result){ 
      if(err) { 
        console.log("Error saving user to database "+ err);
        res.status(500).send("Error saving user to database.")
      } else { 
        cb(true);
      }
    });
  });
};

/* signIn logs the user into the app and sends back the username and uid
 * from the database.
 */
var signIn = function(req, res){ 
  User.findOne({ 
    username: req.body.username.toLowerCase()
  }).exec(function(err, data){ 
    if (err) { 
      console.log("Error in username database query " + err);
      res.status(500).send("Error in username database query");
    } else if (!data){ 
      console.log('Username does not exist. ');
      res.status(418).send("Username does not exist.");
    } else { 
      bcrypt.compare(req.body.password, data.password, function(err, match){ 
        if (err) { 
          console.log("Error comparing hash with user input " + err);
          res.status(500).send("Error comparing hash with user input");
        } else if (!match){ 
          console.log("Incorrect password.");
          res.status(403).send("Incorrect password.");
        } else { 
          res.status(200).send({username: data.username, uid: data.utilityAPIData.uid});
        }
      });
    }
  });
};

/* signUp uses checkUsernameAvail, saveUser, and several UtilityAPI helpers
 * to successfully save a user to the database. This route will return 400s (and won't save
 * user to database) if a user tries to sign up with a non-unique username or the user's 
 * PG&E data is wrong. In addition, it will delete accounts from UtilityAPI that have incorrect
 * PG&E auth information. Once everyting has been correctly saved to the database, the function 
 * responds with the user's username and unique UID.
 *
 * Utility.getActiveUsers is wrapped in a setTimeout function because of a delay in UtilityAPI's
 * server-side account creation.
 */
var signUp = function(req, res){ 
  checkUsernameAvail(req, res, function(){ 

    var requestObj = { 
      // utility: 'PG&E', 
      utility: 'DEMO',
      auth_type: 'owner',
      real_name: req.body.pgeFullName, 
      utility_username: req.body.pgeUsername,
      utility_password: req.body.pgePassword,
    }

    UtilityAPI.postNewUser(JSON.stringify(requestObj), function(user){ 
      console.log("Successfully added account to UtilityAPI.");

    setTimeout(function(){
      UtilityAPI.getActiveUsers(function(accounts){ 
        var foundAccount = false;
        for(var i=0; i<accounts.length; i++){
          var account = accounts[i];
          if(account.account_uid === user.uid){ 
            foundAccount = true;
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
              console.log("User saved to database.");
              res.status(201).send({username: newUserObj.username, uid: newUserObj.utilityAPIData.uid});
            });
          }
        } //end for loop
        
        if(!foundAccount){
          console.log("PG&E registration failed.");
          UtilityAPI.getDeleteCode(user.uid,function(code){ 
            UtilityAPI.postDeleteCode(user.uid, JSON.stringify(code), function(APIresp){ 
              console.log("Successfully deleted account from UtilityAPI.")
              res.status(418).send(APIresp)
            });
          });
        }
      });

    }, 4000);
    });
  });
};

module.exports = { 
  signUp: signUp, 
  getUserUID: getUserUID, 
  signIn: signIn
}

