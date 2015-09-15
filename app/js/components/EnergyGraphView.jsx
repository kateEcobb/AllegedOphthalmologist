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

// Root View //////////////////////////////////////////////////////
/*
  Exposed Properties

  width   - Integer  - width of the graphContainer
  height  - Integer  - height of the graphContainer
  margin  - Integer  - margin around the chartContainer
  tabs    - Boolean  - Choose whether or not to show the tabs bar
  value   - Constant - Taken from Constants.js GraphTypes, choose which graph to show initially
*/
var EnergyGraphView = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margin: React.PropTypes.number,
    tabs: React.PropTypes.bool,
    value: React.PropTypes.string,
  },

  // React Functions /////////////////////////////////

  getInitialState: function() {
    return {
      data: null,
      user: null,
      width: null,
    };
  },

  getDefaultProps: function() {
    return {
      width: 900,
      height: 300,
      margin: 10,
      tabs: false,
      value: GraphTypes.MAIN,
    };
  },

  loadData: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      that.setState({data: DataStore.getData()});

      if (!that.state.data) {
        ViewActions.loadWatt()
        .then(function() {
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });
      }
      else {
        resolve();
      }
    });
  },

  loadUser: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      that.setState({user: UserStore.getUser()});

      if (that.state.user.username) {
        ViewActions.loadUtilityUser()
        .then(function() {
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });
      }
      else {
        resolve();
      }
    });
  },

  handleResize: function() {
    this.setState({width: $('.graphOuterContainer').innerWidth()});
    this.handleTabChange(this);
  },

  loadGraph: function(grapher) {
    var spinnerNode = React.findDOMNode(this.refs.graphSpinner);
    var spinner = d3.select(spinnerNode).style('display', null);
    grapher();
    spinner.style('display', 'none');
  },

  componentDidMount: function() {
    var that = this;

    // Set Stores
    DataStore.addChangeListener(this.loadData);
    UserStore.addChangeListener(this.loadUser);

    // Set other listeners
    window.addEventListener('resize', this.handleResize);

    // I'm not comfortable with doing a random set state here, but I don't know where else to 
    // safely ask for innerWidth(), strongly consider refactor
    this.setState({width: $('.graphOuterContainer').innerWidth()});

    this.loadData()
    .then(this.loadUser)
    .then(function() {
      that.handleTabChange(that);
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

    window.removeEventListener('resize', this.handleResize);
  },

  drawMainGraph: function() {
    var el = React.findDOMNode(this.refs.graphContainer);
    el.innerHTML = '';

    EnergyChart.graph(el, {
      height: this.props.height,
      width: this.state.width - 2 * this.props.margin,
      margin: this.props.margin,
      type: GraphTypes.MAIN,
    }, this.state);
  },

  drawUserGraph: function() {

    var el = React.findDOMNode(this.refs.graphContainer);
    el.innerHTML = '';

    if (this.state.user.username) {
      if (this.state.data.Utility.length > 1) {
        EnergyChart.graph(el, {
          height: this.props.height,
          width: this.state.width - 2 * this.props.margin,
          margin: this.props.margin,
          type: GraphTypes.USER_KWH,
        }, this.state);
      }
    }
    else {
      EnergyChart.graph(el, {
        height: this.props.height,
        width: this.state.width - 2 * this.props.margin,
        margin: this.props.margin,
        type: GraphTypes.USER_REQUIRE,
      }, this.state);
    }
  },

  handleTabChange: function(tab) {

    switch(tab.props.value) {

      case GraphTypes.MAIN:
        this.loadGraph(this.drawMainGraph);
        break;

      case GraphTypes.USER_KWH:
        this.loadGraph(this.drawUserGraph);
        break;

      default:
        var el = React.findDOMNode(this.refs.graphContainer);
        console.log("TAB ERROR");
        el.innerHTML = '';
        break;
    }
  },

  render: function () {
    var tabs = this.props.tabs ? <GraphToolBar handleTabChange={this.handleTabChange} ref='graphToolBar' value={this.props.value} /> : "";
    return (

      <Paper className="mainGraphView" style={{margin: '30px 0'}}>
        {tabs}
        <div className='graphOuterContainer' style={{width: '80%', height: this.props.height + this.props.margin}}>
          <div className='spinner-container' ref='graphSpinner' style={{width: this.props.width, height: this.props.height, display: 'none', visibility: 'visible'}}>
            <div className='spinner-loader'></div>
          </div>
          <div className="graphContainer" ref="graphContainer"></div>
        </div>
      </Paper>

    );
  },

});

module.exports = EnergyGraphView;
