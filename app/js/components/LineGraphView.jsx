var React = require('react');
var d3 = require('d3');
var lineChart = require('./lineChart.js');
var userLineChart = require('./userLineChart.js');

// Actions
var ViewActions = require('./../actions/ViewActions');

// Store
var DataStore = require('./../stores/DataStore');

// Root View
var LineGraphView = React.createClass({

  // React Functions /////////////////////////////////

  getInitialState: function() {
    return {};
  },

  loadData: function() {
    this.setState({data: DataStore.getData()});
  },

  componentDidMount: function() {
    DataStore.addChangeListener(this.loadData);
    ViewActions.loadWatt()
    .then(ViewActions.loadUtility)
    .catch(function(err) {
      console.log("ERROR: ", err);
    });
  },

  componentDidUpdate: function() {
    var el = React.findDOMNode(this);
    el.innerHTML = '';
    console.log(this.state.data.Watt[0]);
    lineChart.createChart(el, {
      width: '1000',
      height: '500',
      margin: '10'
    }, this.state);
    if (this.state.data.Utility.length > 1) {
      userLineChart.createChart(el.children[0], {
        width: '1000',
        height: '500',
        margin: '10'
      }, this.state);
    }
  },

  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.loadData);
  },

  render: function () {
    return (

      <div className="lineContainer"></div>

    );
  },

});

module.exports = LineGraphView;