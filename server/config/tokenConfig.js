if(!process.env.deploy === 'production'){
  var tokens = require('./../tokens');
}
else{
  var tokens = {
    utilityAPIToken: process.env.utilityAPIToken,
    wattTimeAPIToken: process.env.wattTimeAPIToken
  }
}

module.exports = tokens;