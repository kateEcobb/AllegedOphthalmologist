var React = require('react');

//material ui
var mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var ThemeManager = new mui.Styles.ThemeManager();

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');
var modalStore = require('./../stores/modalStore');

// Child Views
var LineGraphView = require('./LineGraphView.jsx');
var GraphToolBar = require('./graphToolBar.jsx');
var donutGraphWindow = require('./energyBreakDownView.jsx')


var MainView = React.createClass({
  getInitialState: function(){
    return {
      showModal: modalStore.getModalState().isOpen,
      modal: null,
    };
  },

  childContextTypes: {
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
    var context = this;
    modalStore.addChangeListener(function(){
      var modalSpecs = modalStore.getModalState();
      context.setState({showModal: modalSpecs.isOpen, modal: modalSpecs.modal});
    })
    // DataStore.addChangeListener(this.loadData);
    // ViewActions.loadWatt()
    // .then(ViewActions.loadUtility)
    // .catch(function(err) {
    //   console.log("ERROR: ", err);
    // });
    // window.addEventListener('close', function(){
    //   console.log('modal closed');
    // })
  },
  
  componentWillUnmount: function (){
    // DataStore.removeChangeListener(this.loadData);
  },

  modals: {
    donutModal: donutGraphWindow, 
  }, 

  showDonutGraph: function(event){
    ViewActions.loadModal(this.modals[event.target.id]);
  },

  render: function() {
    if(this.state.showModal){
      return (
        <div>
          <div className="bulb">
            <button id='donutModal' onClick={this.showDonutGraph}>Launch Modal</button>   
          </div>   
            <LineGraphView /> 
            <this.state.modal openImmediately={true}/>
        </div>
      )
    }else{
      return (
        <div>
          <div className="bulb">
            <button id='donutModal' onClick={this.showDonutGraph}>Launch Modal</button>   
          </div>   
            <LineGraphView />     
        </div>
      );
    }
  }
});




module.exports = MainView;
        
