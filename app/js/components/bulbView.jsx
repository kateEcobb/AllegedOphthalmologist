var React = require('react');

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var BulbStore = require('./../stores/BulbStore');

//Donut Modal
var donutGraphWindow = require('./energyBreakDownView.jsx');

//D3
var BulbGlow = require('./bulbGlow.js');

var BulbView = React.createClass({ 
  getInitialState: function(){ 
    return { 
      bulbData: null, 
      rgb: null
    };
  }, 

  loadData: function(){ 
    this.setState({bulbData: BulbStore.getData()});
  }, 

  bulbListener: function(){ 
    this.setState({bulbData: BulbStore.getData()});
    if(this.state.bulbData > 0.5){ 
      var green = Math.floor(((this.state.bulbData-0.5)/0.5)*255); 
      console.log(green);
      this.setState({rgb: 'rgb(255,'+(255-green)+',0)'});

    } else if(this.state.bulbData < 0.5){ 
      var red = Math.floor((this.state.bulbData/0.5)*255);
      this.setState({rgb: 'rgb('+red+',255,0)'});

    } else { 
      this.setState({rgb: 'rgb(255,255,0)'});
    }    
  },

  componentDidMount: function(){ 
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

  showDonutGraph: function(){
    ViewActions.loadModal(donutGraphWindow);
  },

  render: function(){ 
    return ( 
      <div className='bulbcontainer'>
        <div className="bulb" ref='bulb'></div>
        <img src={'http://uxrepo.com/static/icon-sets/ionicons/png32/256/000000/ios7-lightbulb-outline-256-000000.png'} 
             id='donutModal' className='img-responsive' onClick={this.showDonutGraph}/>     
      </div> 
      );
  }
}); 

module.exports = BulbView;

