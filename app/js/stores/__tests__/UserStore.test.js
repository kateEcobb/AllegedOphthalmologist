const rewire = require("rewire");

var UserStore = rewire('../UserStore');


describe("UserStore", function () {
  
  it("should be an object", function () {
    expect(typeof UserStore).toEqual('object');
  });
  
  it("should have a addChangeListener function", function () {
    expect(typeof UserStore.addChangeListener).toEqual('function');
  });

  it("should have a removeChangeListener function", function () {
    expect(typeof UserStore.removeChangeListener).toEqual('function');
  });
  
  it("should have a logoutUser function", function () {
    expect(typeof UserStore.logoutUser).toEqual('function');
  });
  
  xit("should have a something function", function () {
    expect(true).toBe(true);
  });
  
  xit("should have a something function", function () {
    expect(true).toBe(true);
  });

});