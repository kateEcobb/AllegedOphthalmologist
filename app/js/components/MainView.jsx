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
var GraphTypes = require('./../constants/Constants').GraphTypes;

//Store
var DataStore = require('./../stores/DataStore');
var BulbStore = require('./../stores/BulbStore');

// Child Views
var EnergyGraphView = require('./EnergyGraphView.jsx');
var GraphToolBar = require('./graphToolBar.jsx');
var BulbView = require('./bulbView.jsx');

var MainView = React.createClass({

  showDonutModal: function(){
    ViewActions.loadModal(donutGraphWindow);
  },

  render: function() {
    return (
      <div className='MainView'>
      <div className="app-title">
        <h1>GridAware</h1>
        Compare your Energy Use to Current Grid Conditions
      </div>
          <BulbView loadModal={true} name={"bulbContainer1"} SVGname={'bulb1'} height={100} width={100} margin={5} cy={30} cx={30} r={30} />   
          <EnergyGraphView height={300} width={900} margin={10} tabs={true} /*value={GraphTypes.USER_MAIN}*/ />  
      </div>
    );
  }
});

module.exports = MainView;
        
