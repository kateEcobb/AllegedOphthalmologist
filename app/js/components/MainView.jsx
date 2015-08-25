var React = require('react');

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');

var MainView = React.createClass({
  getInitialState: function(){
    return {
      data: {
        energy_state: null,
        at_peak: null
      }
    }
  },
  loadData: function (data) {
    this.setState({data: DataStore.getData()});
  },
  componentDidMount: function (){
    DataStore.addChangeListener(this.loadData);
    ViewActions.loadData();
  },
  componentWillUnmount: function (){
    DataStore.removeChangeListener(this.loadData);
  },
  render: function() {
    return (
      <div>This is the MainView
      <div>Power is Currently {this.state.data.energy_state}</div>
      {(this.state.data.at_peak) ? <div>At Peak Use!</div> : null}


      
      </div>
      
    );
  }
});

module.exports = MainView;