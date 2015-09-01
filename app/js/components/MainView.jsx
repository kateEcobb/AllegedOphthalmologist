var React = require('react');

//material ui
var mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var ThemeManager = new mui.Styles.ThemeManager();


//dialog boxes
var ModalI = require('./energyBreakDownView.jsx');
var DialogWindow = require('./dialogWindow.jsx');
var Registration = require('./RegistrationView.jsx');

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');

// Child Views
var LineGraphView = require('./LineGraphView.jsx');
var GraphToolBar = require('./graphToolBar.jsx');
var ModalI = require('./energyBreakDownView.jsx')


var MainView = React.createClass({
  getInitialState: function(){
    return {};
  },

  childContextTypes: {
    // console.log(this.context)
    muiTheme: React.PropTypes.object,
  },
  
  getChildContext: function(){
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },
  
  loadData: function (data) {
    // this.setState({data: DataStore.getData()});
  },
  
  componentDidMount: function (){
    // DataStore.addChangeListener(this.loadData);
    // ViewActions.loadWatt()
    // .then(ViewActions.loadUtility)
    // .catch(function(err) {
    //   console.log("ERROR: ", err);
    // });
  },
  
  componentWillUnmount: function (){
    // DataStore.removeChangeListener(this.loadData);
  },

  render: function() {
    return (
      <div>
        <div className="bulb">
          <ModalI>Launch Modal</ModalI>   
        </div>   

        <DialogWindow>
          Registration
          <Registration />
        </DialogWindow>
        
        <DialogWindow>
          Line Graph
          <LineGraphView />     
        </DialogWindow>


      </div>
      
    );
  }
});




module.exports = MainView;
