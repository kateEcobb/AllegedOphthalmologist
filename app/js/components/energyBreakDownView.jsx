var React = require('react');
var chart = require('./donutChart.js');

//material ui
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

//dialog
var Dialog = require('./dialogWindow.jsx');

//stores
var DataStore = require('./../stores/DataStore');
var modalStore = require('./../stores/modalStore');

var ViewActions = require('./../actions/ViewActions')

var ModalI = React.createClass({

  getInitialState: function(){
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
    };
  },

  componentDidMount: function(){
    this.setState({ data: DataStore.getData() });
  },

  componentDidUpdate: function(){
    chart.create('.modal-body', this.state.data.Watt[0].genmix.slice(1, 4), 'test1');
    chart.create('.modal-body', this.state.data.Watt[0].genmix, 'test2');
  },

  render: function(){
    // button can be used with any conent that the <ModalInstance> tag is wrapped around
    // or the div can be used to wrap around other things like images
    var modalbody = 'modal-body';

    return (
      <div>
        <Dialog 
          openImmediately={this.props.openImmediately}>
          
          <div style={{'height': '500px'}} className={modalbody}>
            <h4>This is a break down of how the grid is being powered</h4> 
          </div>
          
        </Dialog>
      </div>
    )
  }
});


module.exports = ModalI;