var React = require('react');
var d3 = require('d3');
var lineChart = require('./lineChart.js');
var userLineChart = require('./userLineChart.js');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Card = mui.Card;

// Actions
var ViewActions = require('./../actions/ViewActions');

// Store
var DataStore = require('./../stores/DataStore');

// Child Views
var GraphToolBar = require('./graphToolBar.jsx');

// Root View
var LineGraphView = React.createClass({

  // React Functions /////////////////////////////////

  getInitialState: function() {
    return {};
  },

  loadData: function() {
    this.setState({data: DataStore.getData()});
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentDidMount: function() {
    DataStore.addChangeListener(this.loadData);
    ViewActions.loadWatt()
    .then(ViewActions.loadUtility)
    .then(this.drawMainGraph)
    .catch(function(err) {
      console.log("ERROR: ", err);
    });
  },

  componentDidUpdate: function() {
    // var el = React.findDOMNode(this.refs.graphContainer);
    // el.innerHTML = '';
    // console.log(this.state.data.Watt[0]);
    // lineChart.createChart(el, {
    //   width: '1000',
    //   height: '500',
    //   margin: '10'
    // }, this.state);
    // if (this.state.data.Utility.length > 1) {
    //   userLineChart.createChart(el.children[0], {
    //     width: '1000',
    //     height: '500',
    //     margin: '10'
    //   }, this.state);
    // }
  },

  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.loadData);
  },

  drawMainGraph: function() {
    var el = React.findDOMNode(this.refs.graphContainer);
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
        margin: '10',
        ratio: false
      }, this.state);
    }
  },

  drawUserGraph: function() {
    var el = React.findDOMNode(this.refs.graphContainer);
    el.innerHTML = '';
    userLineChart.createChart(el, {
      width: '1000',
      height: '500',
      margin: '10',
      ratio: true
    }, this.state);
  },

  handleTabChange: function(tab) {
    // console.log("This was a test of the emergency broadcast system", tab);
    switch(tab.props.label) {
      case "Main":
        this.drawMainGraph();
        break;
      case "Item Two":
        this.drawUserGraph();
        break;
      default:
        var el = React.findDOMNode(this.refs.graphContainer);
        el.innerHTML = '';
        break;
    }
  },

  render: function () {
    return (

      <div className="mainGraphView">
        <GraphToolBar handleTabChange={this.handleTabChange} />
        <div className ="graphContainer" ref="graphContainer"></div>
      </div>

    );
  },

});

module.exports = LineGraphView;