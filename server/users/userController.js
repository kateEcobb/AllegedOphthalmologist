var bcrypt = require('bcrypt');
var User = require('./userModel');
var UtilityAPI = require('./UtilityAPI');


var getUserUID = function(){ 


};

var checkUsernameAvail = function(req, res, cb){ 
  User.findOne({
    username: req.body.username
  }.exec(function(err,data){ 
    if(err) console.log('Error in user database query ' + err);
    if(data){ 
      console.log('Username already exists.');
      res.status(418).send();
    } else {
      cb(true)
    }
  });
};


var signup = function(req, res, cb){ 
  checkUsernameAvail(req, res, function({ 
    
    var requestObj = { 
      utility: 'PG&E', 
      auth_type: 'owner',
      real_name: req.body.pgeFullName, 
      utility_username: req.body.pgeUsername,
      utility_password: req.body.pgePassword,
    }

    UtilityAPI.postNewUser(JSON.stringify(requestObj), function(status){ 
      console.log("Successfully added account.")
      console.log(status)

      UtilityAPI.getUserServices(function(response){ 


      })
    })


  })

      bcrypt.hash(req.body.password, 8, function(err, hash){ 
        var newUser = new User({ 
          username: req.body.username, 
          password: hash,
          utilityAPIData: { 
            account_auth: String,
            uid: String, 
            bill_count: Number, 
            utility: String, 
            utility_service_address: String
          }
        })



      })

    }


  })


}