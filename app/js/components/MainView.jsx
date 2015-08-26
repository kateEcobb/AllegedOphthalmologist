var React = require('react');

var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;

var ModalI = require('./energyBreakDownView.jsx')

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

  //=================================modal functions=======================================================
  openModel: function(){
    this.setState({isModalOpen: true});
  },
  closeModal: function(){
    this.setState({isModalOpen: false});
  },
  //=================================modal functions=======================================================

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
      <div>Power is Currently {this.state.data.energy_state}</div>
      {(this.state.data.at_peak) ? <div>At Peak Use!</div> : null}


      <Button bsStyle='primary' onClick={this.openModel}>open modal</Button>
      

      <ModalI isOpen={this.state.isModalOpen}>
        <h3>You did it!!!!</h3>
        <Button bsStyle='primary' onClick={this.closeModal}>Close modal</Button>
      </ModalI>

      </div>
      
    );
  }
});

//========================================== modal window test ======================================================================

// var ModalI = React.createClass({
//   render: function(){
//     if(this.props.isOpen){
//       return (
//         <div className='static-modal'>
//           <Modal.Dialog>
//             <Modal.Header>
//               <Modal.Title>This is a modal</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>  
//               { this.props.children[0] }
//             </Modal.Body>
//             <Modal.Footer>
//               { this.props.children[1] }
//             </Modal.Footer>
//           </Modal.Dialog>
//         </div>
//       )
//     }else{
//       return (<div></div>)
//     }
//   }
// });

//==========================================end modal===================================================================================
module.exports = MainView;