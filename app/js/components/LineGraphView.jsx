var React = require('react');
var d3 = require('d3');
// var lineChart = require('./lineChart.js');
// var userLineChart = require('./userLineChart.js');
var EnergyChart = require('./EnergyChart.js');
var GraphTypes = require('../constants/Constants.js').GraphTypes;

// Actions
var ViewActions = require('./../actions/ViewActions');

// Store
var DataStore = require('./../stores/DataStore');
var UserStore = require('./../stores/UserStore');

// Child Views
var GraphToolBar = require('./graphToolBar.jsx');

// Root View
var LineGraphView = React.createClass({

  // React Functions /////////////////////////////////

  getInitialState: function() {
    return {
      data: null,
      user: null,
    };
  },

  loadData: function() {
    this.setState({data: DataStore.getData()});
  },

  loadUser: function() {
    this.setState({user: UserStore.getUser()});
    ViewActions.loadUtilityUser();
  },

  componentDidMount: function() {
    var that = this;

    // Set Stores
    DataStore.addChangeListener(this.loadData);
    UserStore.addChangeListener(this.loadUser);

    ViewActions.loadWatt()
    .then(this.drawMainGraph)
    .then(function() {
      console.log(that.state);
      if (that.state.user) {
        ViewActions.loadUtilityUser();
      }
      return;
    })
    .catch(function(err) {
      console.log("ERROR: ", err);
    });
  },

  componentDidUpdate: function() {

  },

  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.loadData);
    UserStore.removeChangeListener(this.loadUser);
  },

  drawMainGraph: function() {
    // console.log(this.state.data.Utility);
    var el = React.findDOMNode(this.refs.graphContainer);
    console.log(React.findDOMNode(this).offsetWidth);
    el.innerHTML = '';
    console.log(this.state.data.Watt[0]);
    EnergyChart.graph(el, {
      height: 500,
      width: 1000,
      margin: 10,
      type: GraphTypes.MAIN,
    }, this.state);
  },

  drawUserGraph: function() {
    var el = React.findDOMNode(this.refs.graphContainer);
    el.innerHTML = '';
    if (this.state.user) {
      console.log(this.state.user);
      if (this.state.data.Utility.length > 1) {
        EnergyChart.graph(el, {
          height: 500,
          width: 1000,
          margin: 10,
          type: GraphTypes.USER_MWH,
        }, this.state);
      }
    }
    else {
      console.log("Not logged in");
      EnergyChart.graph(el, {
        height: 500,
        width: 1000,
        margin: 10,
        type: GraphTypes.USER_REQUIRE,
      }, this.state);
    }
  },

  handleTabChange: function(tab) {
    switch(tab.props.value) {
      case GraphTypes.MAIN:
        this.drawMainGraph();
        break;
      case GraphTypes.USER_MWH:
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
        <GraphToolBar handleTabChange={this.handleTabChange} width={1020} />
        <div className ="graphContainer" ref="graphContainer"></div>
      </div>

    );
  },

});

module.exports = LineGraphView;