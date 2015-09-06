var React = require('react');
var Donuts = require('./donutChart.js');

//material-ui
var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;

//Stores
var DataStore = require('./../stores/DataStore');

//Child Views
var BulbView = require('./bulbView.jsx');
var donutModals = require('./energyBreakDownView.jsx');


var AboutUs = React.createClass({ 
  getInitialState: function(){ 
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
    };
  },

  componentWillMount: function(){ 
    this.setState({data: DataStore.getData() })
    // .then(this.makeGraphs);


  }, 

  makeGraphs: function(){ 
    Donuts.create('.modal1', this.state.data.Watt[0].genmix.slice(1, 4), 'donut1');
    Donuts.create('.modal2', this.state.data.Watt[0].genmix, 'donut2');
  },

  render: function(){ 
    var modal1 = '.modal1';
    var modal2 = '.modal2';
    return ( 
      <div> 

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
                      test!!!
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

      <aside className="image-bg-fixed-height"></aside>

        <div className = {modal1}></div>
        <div className = {modal2}></div>
      </div>
    )

  }


});

module.exports = AboutUs;

