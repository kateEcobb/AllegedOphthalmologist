var React = require('react');
var chart = require('./chart.jsx');


var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;


var ModalI = React.createClass({

  getInitialState: function(){
    return {showModal: false};
  },

  getChartState: function(){
    return {
      data: this.props.data,
      domain: this.props.domain
    }
  },

  componentDidUpdate: function(){
    chart.create('.modal-body');
  },

  open: function(){
    this.setState({showModal: true});
  },

  close: function(){
    this.setState({showModal: false})
  },

  render: function(){
    return (
      <div>
        <Button onClick={this.open}>Launch</Button>

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
