var React = require('react');

//material ui
var mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var ThemeManager = new mui.Styles.ThemeManager();

var ModalI = require('./energyBreakDownView.jsx')

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');

// Child Views
var LineGraphView = require('./LineGraphView.jsx');

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
      <div>This is the MainView
        <div>Watt is Currently </div>     
        <div>Power is Currently</div>

        <ModalI>Launch Modal</ModalI>      

        <LineGraphView />     

      </div>
      
    );
  }
});



module.exports = MainView;

/*{this.state.data}*/
/*{this.state.data.energy_state}*/
