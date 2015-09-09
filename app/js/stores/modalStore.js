var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/Dispatcher');
var ActionTypes = require('../constants/Constants').ActionTypes;

var CHANGE_EVENT = 'change';

var modalStats = {
  isOpen: false,
  modal: null,
};

var ModalStore = assign({}, EventEmitter.prototype, {
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },
  toggleModal: function(){
    modalStats.isOpen = !modalStats.isOpen;
  },
  getModalState: function(){
    return modalStats;
  },
  setModal: function(modal){
    modalStats.modal = modal;
  }
});

ModalStore.dispatchToken = Dispatcher.register(function(dispatcher){

  var action = dispatcher.action;
  var actions = {
    USER_LOGIN: 'dismiss dailog box when user login in',
    LOAD_MODAL: 'load dialog box if payload is provided',
    register: 'dismiss dialog box when user registers',
  };
  if(actions.hasOwnProperty(action.type)){
    ModalStore.toggleModal();
    if(modalStats.isOpen){
      ModalStore.setModal(action.payload);
    }else{
      ModalStore.setModal(null);
    }
    ModalStore.emitChange();
  }

});

module.exports = ModalStore;
