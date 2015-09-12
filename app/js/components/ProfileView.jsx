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
        name: "Off Peak Use",
        color: "Green",
        value: this.state.summaryData.greenIntervalKwh
      },
      {
        name: "Peak Use",
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
      <section id='cont5'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <h1 className='section-heading'>Hello, {this.state.user.name.split(' ')[0]}</h1>
          </div>
          </div>
        </div>
      </section>

          <section id='cont4'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12'>

                  <h3>Last Week:</h3>
                  <p className="week-range">{this.state.summaryData.weekStartString} to {this.state.summaryData.weekEndString}</p>
            
                 <p>Total Energy Used:</p>
                 <p>{this.state.summaryData.latestWeekKwhUsed} kWh.</p>
            

                  <BarChart data={this.state.barChartData}/>
                  <GraphView height={300} width={708} margin={10} tabs={false} value={GraphTypes.USER_KWH} />
          </div>
        </div>
      </div>
    </section>
    </div>

    );
  }
});

module.exports = ProfileView;