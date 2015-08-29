var React = require('react');
var chart = require('./donutChart.js');


var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;

var DataStore = require('./../stores/DataStore');


var ModalI = React.createClass({

  getInitialState: function(){
    return {
      data: {
        "Watt": [{}],
        "Utility": [{}]
      },
      showModal: false,
    };
  },

  componentDidMount: function(){
    this.setState({ data: DataStore.getData() });
  },

  componentDidUpdate: function(){
    // console.log(this.state.data.Watt[0].genmix, '==================hello===============================')
    chart.create('.modal-body', this.state.data.Watt[0].genmix.slice(1, 4), 'test1');
    chart.create('.modal-body', this.state.data.Watt[0].genmix, 'test2');
  },

  open: function(){
    this.setState({showModal: true});
  },

  close: function(){
    this.setState({showModal: false})
  },

  render: function(){
    // button can be used with any conent that the <ModalInstance> tag is wrapped around
    // or the div can be used to wrap around other things like images
    // <div onClick={this.open}>{this.props.children}</div> 
    return (
      <div>

        <Button onClick={this.open}>{this.props.children}</Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>This is a modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>  
            <div>this is a break down of where the electricity is coming from</div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
});


module.exports = ModalI;
