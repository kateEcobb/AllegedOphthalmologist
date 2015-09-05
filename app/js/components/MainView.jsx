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

var BulbGlow = require('./bulbGlow.js');

var MainView = React.createClass({
  
  getInitialState: function(){
    return {
      bulbData: null, 
      rgb: null
    };
  },
  
  loadData: function () {
    this.setState({bulbData: BulbStore.getData()});
  },

  bulbListener: function(){ 
    this.setState({bulbData: BulbStore.getData()});
    if(this.state.bulbData > 0.5){ 
      var green = Math.floor(((this.state.bulbData-0.5)/0.5)*255); 
      this.setState({rgb: 'rgb(255,'+green+',0)'});

    } else if(this.state.bulbData < 0.5){ 
      var red = Math.floor((this.state.bulbData/0.5)*255);
      this.setState({rgb: 'rgb('+red+',255,0)'});

    } else { 
      this.setState({rgb: 'rgb(255,255,0)'});
    }    

  }, 
  
  componentDidMount: function (){
    BulbStore.addChangeListener(this.bulbListener);
    ViewActions.getBulbColor()
    .then(this.drawBulbGlow)
    .catch(function(err){ 
      console.log("Error: " + err);
    });
  },

  drawBulbGlow: function(){ 
    var el = React.findDOMNode(this.refs.bulb); 
    el.innerHTML = '';
    BulbGlow.makeCircle(el, { 
      height: 100,
      width: 100,
      margin: 5
    }, this.state.rgb);
  },

  showDonutModal: function(){
    ViewActions.loadModal(donutGraphWindow);
  },

  render: function() {
    return (
      <div>
        <div className='bulbcontainer'>
          <div className="bulb" ref='bulb'></div>
          <img src={'http://uxrepo.com/static/icon-sets/ionicons/png32/256/000000/ios7-lightbulb-outline-256-000000.png'} id='donutModal' className='img-responsive' onClick={this.showDonutModal}/>    
        </div>   
          <LineGraphView height={300} width={900} margin={5} />  
      </div>
    );
  }
});

module.exports = MainView;
        
