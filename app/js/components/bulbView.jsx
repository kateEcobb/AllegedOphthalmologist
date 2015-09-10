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
      // console.log(green);
      this.setState({rgb: 'rgb(255,'+(255-green)+',0)'});

    } else if(this.state.bulbData < 0.5){ 
      var red = Math.floor((this.state.bulbData/0.5)*255);
      this.setState({rgb: 'rgb('+red+',255,0)'});

    } else { 
      this.setState({rgb: 'rgb(255,255,0)'});
    }

    this.drawBulbGlow();    
  },

  componentDidMount: function(){
    BulbStore.addChangeListener(this.bulbListener); 
    ViewActions.getBulbColor();
  },

  componentWillUnmount: function(){
    BulbStore.removeChangeListener(this.bulbListener);
  },

  drawBulbGlow: function(){
    var el = React.findDOMNode(this.refs.bulb); 
    el.innerHTML = '';
    BulbGlow.makeCircle(el, { 

      height: this.props.height,
      width: this.props.width,
      margin: this.props.margin, 
      cy: this.props.cy,
      cx: this.props.cx,
      r: this.props.r
    }, this.state.rgb);
  },

  showDonutGraph: function(){
    if(this.props.loadModal){ 
      ViewActions.loadModal(donutGraphWindow);
    }
  },

  render: function(){ 
    return ( 
      <div className={this.props.name}>
        <div className={this.props.SVGname} ref='bulb'></div>
        <img src={'http://uxrepo.com/static/icon-sets/ionicons/png32/256/000000/ios7-lightbulb-outline-256-000000.png'} 
             id='donutModal' className='img-responsive' onClick={this.showDonutGraph}/>     
      </div> 
      );
  }
}); 

module.exports = BulbView;

