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
    return {
      showModal: false,
      modal: null,
    };
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
    window.addEventListener('close', function(){
      console.log('modal closed');
    })
  },
  
  componentWillUnmount: function (){
    // DataStore.removeChangeListener(this.loadData);
  },

  modals: {
    donutModal: ModalI, 
  }, 

  show: function(event){
    console.log(this.state);
    this.setState({showModal: true, modal: this.modals[event.target.id]});

    // ModalI.addEventListener(this.close);
  },

  render: function() {
    if(this.state.showModal){
      return (
        <div>
          <div className="bulb">
            <button id='donutModal' onClick={this.show}>Launch Modal</button>   
          </div>   
            <LineGraphView /> 
            <this.state.modal openImmediately={true}/>
        </div>
      )
    }else{
      return (
        <div>
          <div className="bulb">
            <button id='donutModal' onClick={this.show}>Launch Modal</button>   
          </div>   
            <LineGraphView />     
        </div>
      );
    }
  }
});




module.exports = MainView;
        
