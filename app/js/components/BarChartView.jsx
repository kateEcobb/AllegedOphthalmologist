var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

// Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

// ViewActions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

// Bar Graph
var makeBarChart = require('./barChart');

var BarChartView = React.createClass({

  hasLoaded: false,

  componentWillReceiveProps: function(newProps){
    if(newProps.data.length && newProps.data.length === 2
      && newProps.data[0].value && !this.hasLoaded){
      //console.log(newProps);
      makeBarChart(newProps.data);
      this.hasLoaded = true;
    }
  },

  render: function(){
    return(
      <svg className="energy-bar-graph"></svg>
    );
  }
});

module.exports = BarChartView;