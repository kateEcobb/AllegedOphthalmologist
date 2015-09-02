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
      <div className="tasdf">
        <Tabs onChange={this.handleTabChange}>
          <Tab label="Main" value={GraphTypes.MAIN}></Tab>
          <Tab label="User" value={GraphTypes.USER_CARBON}></Tab>
        </Tabs>
      </div>
    );
  }

});

module.exports = graphToolBar;