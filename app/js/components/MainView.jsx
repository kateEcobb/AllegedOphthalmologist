var React = require('react');

// Actions
var ViewActions = require('./../actions/ViewActions');

//Store
var DataStore = require('./../stores/DataStore');

var MainView = React.createClass({
  getInitialState: function(){
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      }
    };
  },
  loadData: function (data) {
    this.setState({data: DataStore.getData()});
  },
  componentDidMount: function (){
    DataStore.addChangeListener(this.loadData);
    ViewActions.loadWatt()
    .then(ViewActions.loadUtility)
    .catch(function(err) {
      console.log("ERROR: ", err);
    });
  },
  componentWillUnmount: function (){
    DataStore.removeChangeListener(this.loadData);
  },
  render: function() {
    return (
      <div>This is the MainView
      <div>Watt is Currently {this.state.data}</div>     
      </div>
      
    );
  }
});

module.exports = MainView;