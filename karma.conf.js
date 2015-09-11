var RewireWebpackPlugin = require("rewire-webpack");

var webpackConfig = {
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'jsx-loader'},
    ]
  },
  resolve: { extentions: ['', '.js', '.jsx'] },
  plugins: [
    new RewireWebpackPlugin(),
  ],
};


const karmaConfig = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    reporters: ["progress", 'spec'],
    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ["Chrome"],
    singleRun: true,

    files: ["tests.webpack.js"],
    preprocessors: {
      "tests.webpack.js": ['webpack'],
    },  
    webpack: webpackConfig,
    plugins: [
      require("karma-jasmine"),
      require("karma-spec-reporter"),
      require("karma-webpack"),
      require("karma-chrome-launcher"),
    ]
  });
};


module.exports = karmaConfig;