var React = require('react');
var Donuts = require('./donutChart.js');

//material-ui
var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;

//Stores
var DataStore = require('./../stores/DataStore');
var modalStore = require('./../stores/modalStore');

//Child Views
var BulbView = require('./bulbView.jsx');
var donutModals = require('./energyBreakDownView.jsx');

//Actions
var ViewActions = require('./../actions/ViewActions');


var AboutUs = React.createClass({ 
  getInitialState: function(){ 
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
    };
  },

  loadData: function(){ 
    this.setState({data: DataStore.getData()});
  },

  componentDidMount: function(){ 
    DataStore.addChangeListener(this.loadData);


    ViewActions.loadWatt()
    .then(this.makeGraphs)
    .catch(function(err){ 
      console.log("ERROR: ");
      console.trace(err);
    });
  }, 

  componentDidUpdate: function(){ 
    // this.makeGraphs();
    window.addEventListener('resize', this.reSizeGraphs);
  },

  componentWillUnmount: function(){ 
    window.removeEventListener('resize', this.reSizeGraphs);
  },

  reSizeGraphs: function(){ 
    Donuts.removeGraph('donut1');
    Donuts.removeGraph('donut2');

    this.makeGraphs();
  },

  makeGraphs: function(){ 
    Donuts.create('.donuts', this.state.data.Watt[0].genmix.slice(1, 4), 'donut1');
    Donuts.create('.donuts', this.state.data.Watt[0].genmix, 'donut2');
  },

  render: function(){ 
    console.log(this.state.data);
    var donuts = 'donuts';
    return ( 
      <div className="frontPage"> 

      <header className="image-bg-fluid-height">
        <BulbView loadModal={false} name={"bulbContainer2"} SVGname={"bulb2"} height={400} width={400} margin={5} cx={75} cy={75} r={75} />
      </header>

      <section>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="section-heading">GridAware</h1>
                    <p className="lead section-lead">Compare your Energy Use to Current Grid Conditions</p>
                    <Tabs>
                      <Tab label="About Us"> 
                      <p className='lead section-lead'> All power is not created equal. </p>
                      <div className={donuts} style={{'maxWidth':'400px'}}></div>
                      <p className='section-paragraph'> These pie graphs represent the current real-time breakdown of resources used to 
                      fuel California's power grid. "Other" is a mix of coal, nuclear, natural gas, and other carbon-producing fuels.</p>
                      <p className='section-paragraph'> GridAware empowers consumers to use energy more intelligently and reduce their carbon footprint by providing 
                      frictionless access to current grid conditions. We are thrilled to introduce the GridAware Power Bulb -- 
                      a WiFi-enabled LED bulb that changes color based on energy cleanliness. Put it anywhere in your house or apartment 
                      and start checking the state of California’s grid at a glance!</p>
                      </Tab>
                      <Tab label="How Does The Grid Work!?">
                        <p className="section-paragraph">Each day, the mix of energy generation resources changes as demand fluctuates. 
                        The grid operator must efficiently balance power generation and consumer electricity demand, 
                        using renewable resources whenever possible as conditions allow.</p>

                        <p className="section-paragraph">Periods of high demand and low availability of renewable generation resources translate to more pollution 
                        associated with each unit of energy consumed. Periods of low demand and high availability of 
                        renewable resources mean less pollution is associated with the same unit of energy.</p>
                      </Tab>
                      <Tab label="Get Started!"> 
                      <p className="section-paragraph">To get started, use our REGISTRATION page to signup for GridAware, 
                      and link  your SmartMeter at the same time! All you need is your PG&E login.</p>

                      <p className="section-paragraph">Don't have an online account with PG&E yet? 
                      Sign up <a href="https://www.pge.com/myenergyweb/appmanager/pge/register">here!</a></p>

                      <p className="section-paragraph">Once you register, our robots will analyze your energy consumption.
                      This data usually takes approximately 24 hours to become available. Once linked, your hourly consumption 
                      data is typically updated daily.</p>
                      </Tab>

                    </Tabs>

                </div>
            </div>
        </div>
      </section>

        
      </div>
    )

  }


});

module.exports = AboutUs;

