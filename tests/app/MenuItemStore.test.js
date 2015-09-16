const rewire = require("rewire");

var MenuItemStore = rewire('../../app/js/stores/MenuItemStore');


describe("MenuItemStore", function () {
  
  it("should be an object", function (done) {
    expect(typeof MenuItemStore).toEqual('object');
    done();
  });
  
  it("should have a addChangeListener function", function (done) {
    expect(typeof MenuItemStore.addChangeListener).toEqual('function');
    done();
  });

  it("should have a removeChangeListener function", function (done) {
    expect(typeof MenuItemStore.removeChangeListener).toEqual('function');
    done();
  });
  
  it("should have a getActiveItems function", function (done) {
    expect(typeof MenuItemStore.getActiveItems).toEqual('function');
    done();
  });
  
  it("should return array active of objects when getActiveItems is called", function (done) {
    var results = MenuItemStore.getActiveItems();
    var display = true;
    results.forEach(function(item, index){
      if(!item.display){
        display = false;
      }
    });
    expect(display).toBe(true);
    done();
  });
  
  it("should have a toggleDisplay function that changes list of active items", function (done) {
    var initItems = MenuItemStore.getActiveItems();
    initItems.forEach(function(item, index){
      MenuItemStore.toggleDisplay(item);
    })
    var toggledItems = MenuItemStore.getActiveItems();
    expect(toggledItems.length).not.toEqual(initItems.length);
    done();
  });

});