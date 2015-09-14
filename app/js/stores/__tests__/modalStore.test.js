const rewire = require("rewire");

var ModalStore = rewire('../modalStore');


describe("ModalStore", function () {
  
  it("should be an object", function () {
    expect(typeof ModalStore).toEqual('object');
  });
  
  it("should have a addChangeListener function", function () {
    expect(typeof ModalStore.addChangeListener).toEqual('function');
  });

  it("should have a removeChangeListener function", function () {
    expect(typeof ModalStore.removeChangeListener).toEqual('function');
  });
  
  it("should have a toggle function", function () {
    expect(typeof ModalStore.toggleModal).toEqual('function');
  });

  it('should toggle the state of the modal window when toggle is called', function(){
    var open = ModalStore.getModalState().isOpen;
    ModalStore.toggleModal();
    expect(ModalStore.getModalState().isOpen).toBe(!open);
  });
  
  it("should have a set modal function that modifies the modal prop", function () {
    var modal = ModalStore.getModalState().modal;
    ModalStore.setModal({modal: 'test'});
    expect(ModalStore.getModalState().modal).not.toEqual(modal);
  });
  
});