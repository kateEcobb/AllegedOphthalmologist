var React = require('react');

//material ui
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');
var modalStore = require('./../stores/modalStore');
var BulbStore = require('./../stores/BulbStore');

// Child Views
var LineGraphView = require('./LineGraphView.jsx');
var GraphToolBar = require('./graphToolBar.jsx');
var donutGraphWindow = require('./energyBreakDownView.jsx');
var BulbView = require('./bulbView.jsx');

var BulbGlow = require('./bulbGlow.js');

var MainView = React.createClass({
  getInitialState: function(){
    return {
      showModal: modalStore.getModalState().isOpen,
      modal: null
    };
  },

  modalListener: function(){
    var modalSpecs = modalStore.getModalState();
    this.setState({showModal: modalSpecs.isOpen, modal: modalSpecs.modal});
  },
  
  componentDidMount: function (){
    modalStore.addChangeListener(this.modalListener);
  },
  
  componentWillUnmount: function (){
    modalStore.removeChangeListener(this.modalListener);
  },

  modals: {
    donutModal: donutGraphWindow, 
  }, 

  showDonutGraph: function(event){
    ViewActions.loadModal(this.modals[event.target.id]);
  },

  render: function() {
    var that = this;
    if(this.state.showModal){
      return (
        <div>

          <div onClick={this.showDonutGraph}><BulbView/></div> 
          <LineGraphView testing={true}/> 
          <this.state.modal openImmediately={true} dialog={true}/>
        </div>
      );
    }else{
      return (
        <div>
          
          <div onClick={this.showDonutGraph}><BulbView/></div>  
          <LineGraphView />  
        </div>
      );
    }
  }
});




module.exports = MainView;
        
