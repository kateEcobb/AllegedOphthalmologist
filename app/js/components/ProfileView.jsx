var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

// Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

// ViewActions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

//dialog
var Dialog = require('./dialogWindow.jsx');

// Form validation
var Formsy = require('formsy-react');
var FormInput = require('./FormInput.jsx');

// Material UI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Avatar = mui.Avatar;
var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardText = mui.CardText;
var CardActions = mui.CardActions;
var FlatButton = mui.FlatButton;
var Paper = mui.Paper;
var Tabs = mui.Tabs;
var Tab = mui.Tab;

// Graphs
var GraphView = require('./EnergyGraphView.jsx'); 
var GraphTypes = require('./../constants/Constants').GraphTypes; 
var BarChart = require('./BarChartView.jsx'); 

//Stores
var UserStore = require('./../stores/UserStore');
var DataStore = require('./../stores/DataStore');

var ProfileView = React.createClass({

  getInitialState: function() {
    // We can assume that these stores have data because
    // this view is only accessible to a logged in user
    return {
      user: {
        name: null,
        address: null,
        pgeLogin: null
      },
      summaryData: {},
      barChartData: []
    };
  },

  componentWillMount: function(){
    this.updateUserData();
    this.updateSummaryData();
    DataStore.addChangeListener(this.updateSummaryData);
    UserStore.addChangeListener(this.updateUserData);
  },

  updateUserData: function(){
    this.state.user.name = UserStore.getAccountAuth();
    this.state.user.address = UserStore.getServiceAddress();
    this.state.user.pgeLogin = UserStore.getPGEUsername();
  },

  updateSummaryData: function(){
    this.setState({'summaryData': DataStore.getSummaryData()});
    this.setState({'barChartData': [
      {
        color: "Green",
        value: this.state.summaryData.greenIntervalKwh
      },
      {
        color: "Yellow",
        value: this.state.summaryData.yellowIntervalKwh
      },
      {
        color:"Red",
        value: this.state.summaryData.redIntervalKwh
      }]
    });

    console.log(this.state.summaryData);
  },

  componentWillUnmount: function(){
    DataStore.removeChangeListener(this.updateSummaryData);
    UserStore.removeChangeListener(this.updateUserData);
  },


  render: function (){
    return(
      <div>
        <h2 className="profile-header">Hello, {this.state.user.name.split(' ')[0]}</h2>
    
        <div className="container summary-container">  
          <Paper zDepth={2}>
            <div className="week-summary-header">
              <h3>Last Week:</h3>
              <p className="week-range">{this.state.summaryData.weekStartString} to {this.state.summaryData.weekEndString}</p>
            </div>
            
            <div className="week-kwh">
              <p>Total Energy Used:</p>
              <p>{this.state.summaryData.latestWeekKwhUsed} kWh.</p>
            </div>
            <div>
              <BarChart data={this.state.barChartData}/>
            </div>
            
            <div className="user-graph">        
              <GraphView height={300} width={900} margin={10} tabs={false} value={GraphTypes.USER_KWH} />
            </div>
          </Paper>
        </div>
      </div>

    );
  }
});

module.exports = ProfileView;