var React = require('react');
var Donuts = require('./donutChart.js');

//material-ui
var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;

//Stores
var DataStore = require('./../stores/DataStore');
var modalStore = require('./../stores/modalStore');
var BulbStore = require('./../stores/BulbStore');

//Dispatcher
var Dispatcher = require('./../dispatcher/Dispatcher');

//Child Views
var BulbView = require('./bulbView.jsx');
var donutModals = require('./energyBreakDownView.jsx');
var register = require('./RegistrationView.jsx');
var GraphView = require('./EnergyGraphView.jsx');

//Actions
var ViewActions = require('./../actions/ViewActions');
var ActionTypes = require('./../constants/Constants').ActionTypes;

//Constants
var GraphTypes = require('./../constants/Constants').GraphTypes;


var AboutUs = React.createClass({ 
  getInitialState: function(){ 
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
      bulbData: null, 
      gridState: null
    };
  },

  loadData: function(){ 
    this.setState({data: DataStore.getData()});
    this.setState({bulbData: BulbStore.getData()});
  },

  gridState: function(){ 
    this.setState({bulbData: BulbStore.getData()});

    if(this.state.bulbData >= 0.75){ 
      this.setState({gridState: 'dirty'});

    } else if(0.75 > this.state.bulbData && this.state.bulbData >= 0.5){ 
      this.setState({gridState: 'semi-dirty'});

    } else if (0.5 > this.state.bulbData && this.state.bulbData > 0.25){ 
      this.setState({gridState: 'semi-clean'});

    } else if (0.25 >= this.state.bulbData){ 
      this.setState({gridState: 'clean'});
    }

  },
  componentWillMount: function(){
    DataStore.addChangeListener(this.loadData);
    BulbStore.addChangeListener(this.gridState);
  },
  
  componentDidMount: function(){ 
    var context = this;
    this.token = Dispatcher.register(function (dispatch) {
      var action = dispatch.action;
      if (action.type === ActionTypes.WATT_LOADED) {
        context.makeGraphs();
      } 
    });
  }, 

  componentDidUpdate: function(){ 
    window.addEventListener('resize', this.reSizeGraphs);
  },

  componentWillUnmount: function(){ 
    window.removeEventListener('resize', this.reSizeGraphs);
    DataStore.removeChangeListener(this.loadData);
    BulbStore.removeChangeListener(this.gridState);
    Dispatcher.unregister(this.token);
  },

  reSizeGraphs: function(){ 
    Donuts.removeGraph('donut1');
    Donuts.removeGraph('donut2');

    this.makeGraphs();
  },

  makeGraphs: function(){ 
    Donuts.create('.donuts', this.state.data.Watt[0].genmix.slice(1, 4), 'donut1');
      Donuts.subtitle('donut1','breakdownSub', 'Renewable resources breakdown');
    Donuts.create('.donuts', this.state.data.Watt[0].genmix, 'donut2');
      Donuts.subtitle('donut2','totalSub','Resources currently powering the grid');


                      
    // $('.donut1div').append('<span id='breakdownSub'>Current renewable mix.</span>');
    // $('.donut2div').append('<span id='totalSub'>Current total resource mix.</span>');

  },

  handleRegister: function(){
    ViewActions.loadModal(register);
  },


  render: function(){ 
    var donuts = 'donuts';
    return ( 
      <div className="frontPage"> 

      <header className="image-bg-fluid-height" id='home'>
        <BulbView loadModal={false} name={"bulbContainer2"} SVGname={"bulb2"} height={400} width={400} margin={5} cx={75} cy={75} r={75} />
        <div id='cali'>California's power grid is currently <span id='gridstate'>{this.state.gridState}.</span></div>
      </header>

      <section id='about' className='pad-section'>
        <div className='container'>
          <div className="row">
            <div className='col-lg-12'>
              <h1 className="section-heading">GridAware</h1>
              <p className='lead section-lead' id='powernotcreated'> All power is not created equal. </p>
            <hr></hr>
            </div>
          </div>
        </div>
      </section>

      <section id='cont1'>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">

                      <div className={donuts} style={{'maxWidth':'600px', 'margin': 'auto','paddingLeft':'23px', 'position':'relative'}}>
                      </div>
              
                      <p className='section-paragraph'> GridAware empowers consumers to use energy more intelligently and to reduce 
                      their carbon footprint by providing 
                      frictionless access to current grid conditions. We are thrilled to introduce the GridAware Power Bulb —
                      a WiFi-enabled LED bulb that changes color based on energy cleanliness. Put it anywhere in your house or apartment 
                     and start checking the state of California’s grid at a glance!</p>

                    
                </div>
            </div>
        </div>
      </section>
    

    <section id="leaf">
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <span className='glyphicon glyphicon-leaf'></span>
          </div>
        </div>
      </div>
    </section>

    <div id='information' className='pad-section'>
      <section id='cont2'> 
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                  <h2>How Does The Grid Work!?</h2>
          <GraphView height={300} width={800} margin={10} tabs={false} value={GraphTypes.MAIN} />  
                        <p className="section-paragraph">Each day, the mix of energy generation resources changes as demand fluctuates. 
                        The grid operator must efficiently balance power generation and consumer electricity demand, 
                        using renewable resources whenever possible. Periods of high demand and low availability of renewable resources translate to more pollution 
                        per unit of energy consumed. </p>

                        <p className='section-paragraph'> Our web-based analytics platform analyzes data collected from your PG&E SmartMeter 
                     and compares your consumption data to the cleanliness of the grid. 
                     GridAware gives you easy to understand feedback on how your consumption patterns are associated with electricity generation pollution. Combine the
                      GridAware Power Bulb with our application to raise your EnergyIQ and reduce your carbon footprint! </p>
              </div>
            </div>
        </div>
      </section>

      <section id='cont3'> 
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h2>Get Started!</h2> 
                      <p className="section-paragraph">To get started, use our <a className='registerClick' onClick={this.handleRegister}>Registration</a> page to signup for GridAware, 
                      and link  your SmartMeter at the same time! All you need is your PG&E login.

                      Don't have an online account with PG&E yet? 
                      Sign up <a href="https://www.pge.com/myenergyweb/appmanager/pge/register">here!</a></p>

                      <p className="section-paragraph">Once you register, our robots will analyze your energy consumption.
                      This data usually takes approximately 24 hours to become available. Once linked, your hourly consumption 
                      data is typically updated daily.</p>
              </div>
            </div>
        </div>
      </section>
        </div>
      </div>
    );

  }


});

module.exports = AboutUs;

