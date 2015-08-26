var React = require('react');

var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;


var ModalI = React.createClass({
  render: function(){
    if(this.props.isOpen){
      return (
        <div className='static-modal'>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>This is a modal</Modal.Title>
            </Modal.Header>
            <Modal.Body>  
              { this.props.children[0] }
            </Modal.Body>
            <Modal.Footer>
              { this.props.children[1] }
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )
    }else{
      return (<div></div>)
    }
  }
});

energyBreakDownView = ModalI;

module.exports = energyBreakDownView;