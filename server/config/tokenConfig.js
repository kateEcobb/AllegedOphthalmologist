if(!process.env.DEPLOY){
  var tokens = require('./../../.tokens.js');
}
else{
  var tokens = {
    utilityAPIToken: process.env.utilityAPIToken,
    wattTimeAPIToken: process.env.wattTimeAPIToken
  }
}

module.exports = tokens;