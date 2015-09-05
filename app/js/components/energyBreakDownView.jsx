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

var ViewActions = require('./../actions/ViewActions');

var ModalI = React.createClass({

  getInitialState: function(){
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
    };
  },

  dismount: function(){
    var isOpen = modalStore.getModalState().isOpen;
    if(!isOpen){
      window.removeEventListener('resize', this.reSizeGraphs);
    }
  },

  componentDidMount: function(){
    this.setState({ data: DataStore.getData() });
    modalStore.addChangeListener(this.dismount);
  },

  componentDidUpdate: function(){
    this.makeGraphs();
    window.addEventListener('resize', this.reSizeGraphs);
  },

  componentWillUnmount: function(){
    window.removeEventListener('resize', this.reSizeGraphs);
  },

  reSizeGraphs: function(){
    chart.removeGraph('popup1');
    chart.removeGraph('popup2');

    this.makeGraphs();
  },

  makeGraphs: function(){
    chart.create('.modal-body', this.state.data.Watt[0].genmix.slice(1, 4), 'popup1');
    chart.create('.modal-body', this.state.data.Watt[0].genmix, 'popup2');
  },

  render: function(){
    var modalbody = 'modal-body';
    if(this.props.dialog){
      return (
        <div>
          <Dialog 
            openImmediately={this.props.openImmediately}>
            
            <div style={{'textAlign': 'center', 'minWidth':'500px'}} className={modalbody}>
              <h4>This is a break down of how the grid is being powered</h4> 
            </div>
            
          </Dialog>
        </div>
      );
    }else{
      return(
        <div>
          <div style={{'textAlign': 'center'}} className={modalbody}>
            <h4>This is a break down of how the grid is being powered</h4> 
          </div>
        </div>
      );
    }

  }
});


module.exports = ModalI;