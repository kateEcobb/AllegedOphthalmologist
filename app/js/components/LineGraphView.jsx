var React = require('react');
var d3 = require('d3');


var EnergyChart = require('./EnergyChart.js');
var GraphTypes = require('../constants/Constants.js').GraphTypes;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Card = mui.Card;
var Paper = mui.Paper;


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
    console.log(";alskdjf;asldf", this.props);
    // Set Stores
    DataStore.addChangeListener(this.loadData);
    UserStore.addChangeListener(this.loadUser);

    ViewActions.loadWatt()
    .then(this.drawMainGraph)
    .then(function() {
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
    el.innerHTML = '';
    console.log(this.state.data.Watt[0]);
    EnergyChart.graph(el, {
      height: this.props.height,
      width: this.props.width,
      margin: this.props.margin,
      type: GraphTypes.MAIN,
    }, this.state);
  },

  drawUserGraph: function() {
    var el = React.findDOMNode(this.refs.graphContainer);
    el.innerHTML = '';
    if (this.state.user) {
      if (this.state.data.Utility.length > 1) {
        EnergyChart.graph(el, {
          height: 300,
          width: 900,
          margin: 5,
          type: GraphTypes.USER_MWH,
        }, this.state);
      }
    }
    else {
      EnergyChart.graph(el, {
        height: 300,
        width: 900,
        margin: 5,
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

      <Paper className="mainGraphView" style={{margin: '50px', minWidth:"900px"}}>
        <GraphToolBar handleTabChange={this.handleTabChange} />
        <div className='graphOuterContainer'>
          <div className ="graphContainer" ref="graphContainer"></div>
        </div>
      </Paper>

    );
  },

});

module.exports = LineGraphView;
