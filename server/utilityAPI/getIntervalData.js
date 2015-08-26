var request = require('request');

// API Authorization Token:
// Token 398c6d26ff244949bb5f086d5af7e8fb

// UID: 13984

// module.exports = function(uId, startDate, endDate){
//   var uId = 13984;
//   var url = 'https://utilityapi.com/api/services/'+ uId +'/intervals.json?start=2015-08-24&end=2015-08-26'
//   var authHeader = 'Token 398c6d26ff244949bb5f086d5af7e8fb';

//   var options = {
//     url: url,
//     headers: {
//       'Authorization': authHeader
//     }
//   };

//   request.get(options, function(err, response, body){
//     var readingIntervals = JSON.parse(body)
//     console.log(readingIntervals[0]);
//   });
// };



// ("0" + (temp_date.getUTCMonth() + 1)).slice(-2)
// var temp_date = new Date(Date.now());

// console.log(temp_date.toISOString());
// console.log(temp_date.getUTCFullYear());
// console.log(("0" + (temp_date.getUTCMonth() + 1)).slice(-2));

// console.log(temp_date.getUTCDate());



