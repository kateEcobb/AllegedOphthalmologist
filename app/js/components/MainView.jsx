var React = require('react');

//material ui
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');
var modalStore = require('./../stores/modalStore');
var BulbStore = require('./../stores/BulbStore')

// Child Views
var LineGraphView = require('./LineGraphView.jsx');
var GraphToolBar = require('./graphToolBar.jsx');
var donutGraphWindow = require('./energyBreakDownView.jsx');

var BulbGlow = require('./bulbGlow.js');

var MainView = React.createClass({
  getInitialState: function(){
    return {
      showModal: modalStore.getModalState().isOpen,
      modal: null,
      bulbData: null, 
      rgb: null
    };
  },
  
  loadData: function () {
    this.setState({bulbData: BulbStore.getData()});
  },

  bulbListener: function(){ 
    this.setState({bulbData: BulbStore.getData()});
    if(this.state.bulbData > .5){ 
      var green = Math.floor(((this.state.bulbData-.5)/.5)*255) 
      this.setState({rgb: 'rgb(255,'+green+',0)'})

    } else if(this.state.bulbData < .5){ 
      var red = Math.floor((this.state.bulbData/.5)*255)
      this.setState({rgb: 'rgb('+red+',255,0)'})

    } else { 
      this.setState({rgb: 'rgb(255,255,0)'})
    }    

  }, 

  modalListener: function(){
    var modalSpecs = modalStore.getModalState();
    this.setState({showModal: modalSpecs.isOpen, modal: modalSpecs.modal});
  },
  
  componentDidMount: function (){
    modalStore.addChangeListener(this.modalListener);

    BulbStore.addChangeListener(this.bulbListener)
    ViewActions.getBulbColor()
    .then(this.drawBulbGlow)
    .catch(function(err){ 
      console.log("Error: " + err)
    });
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

  drawBulbGlow: function(){ 
    var el = React.findDOMNode(this.refs.bulb); 
    el.innerHTML = ''
    BulbGlow.makeCircle(el, { 
      height: 100,
      width: 100,
      margin: 5
    }, this.state.rgb)
  },

  render: function() {
    if(this.state.showModal){
      return (
        <div>
          <div className='bulbcontainer'>
          <div className="bulb" ref='bulb'></div>
            <img src={'http://uxrepo.com/static/icon-sets/ionicons/png32/256/000000/ios7-lightbulb-outline-256-000000.png'} id='donutModal' className='img-responsive' onClick={this.showDonutGraph}/>     
          </div>  
            <LineGraphView testing={true}/> 
            <this.state.modal openImmediately={true}/>
        </div>
      )
    }else{
      return (
        <div>
          <div className='bulbcontainer'>
          <div className="bulb" ref='bulb'></div>
            <img src={'http://uxrepo.com/static/icon-sets/ionicons/png32/256/000000/ios7-lightbulb-outline-256-000000.png'} id='donutModal' className='img-responsive' onClick={this.showDonutGraph}/>    
          </div>   
            <LineGraphView />  
        </div>
      );
    }
  }
});




module.exports = MainView;
        
