// var context = require.context('./app/js', true, /\.test\.js$/);
var context = require.context('./tests', true, /\.test\.js$/);
context.keys().forEach(context);