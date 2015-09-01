var React = require('react/addons');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

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
  
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function(){
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
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
      <div class="tasdf">
        <Tabs onChange={this.handleTabChange}>
          <Tab label="Main"></Tab>
          <Tab label="Item Two"></Tab>
        </Tabs>
      </div>
    );
  }

});

module.exports = graphToolBar;