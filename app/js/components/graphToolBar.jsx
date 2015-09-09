var React = require('react/addons');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var GraphTypes = require('../constants/Constants.js').GraphTypes;

// Mui Components
var Tabs = mui.Tabs;
var Tab = mui.Tab;

// Actions

// Stores

// Root View
var graphToolBar = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {

  },

  componentDidUpdate: function() {

  },

  componentWillUnmount: function() {

  },

  handleTabChange: function(value, e, tab) {
    this.props.handleTabChange(tab);
  },

  render: function() {
    return (
      <div className="graphToolBar">
        <Tabs value={this.props.value} onChange={this.handleTabChange} style={{width:this.props.width}}>
          <Tab label="Main" value={GraphTypes.MAIN}></Tab>
          <Tab label="User" value={GraphTypes.USER_KWH}></Tab>
        </Tabs>
      </div>
    );
  }

});

module.exports = graphToolBar;