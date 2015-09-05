var React = require('react');

//material ui
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

//Modals
var donutGraphWindow = require('./energyBreakDownView.jsx');

// Actions
var ViewActions = require('./../actions/ViewActions');

// Constants
var Modals = require('./../constants/Constants').ModalTypes;

//Store
var DataStore = require('./../stores/DataStore');
var BulbStore = require('./../stores/BulbStore');

// Child Views
var LineGraphView = require('./LineGraphView.jsx');
var GraphToolBar = require('./graphToolBar.jsx');
var BulbView = require('./bulbView.jsx');

var MainView = React.createClass({

  showDonutModal: function(){
    ViewActions.loadModal(donutGraphWindow);
  },

  render: function() {
    return (
      <div>

          <BulbView height={100} width={100} margin={5} cy={30} cx={30} r={30} />   
          <LineGraphView height={300} width={900} margin={10} />  
      </div>
    );
  }
});

module.exports = MainView;
        
