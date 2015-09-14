const rewire = require("rewire");

var DataStore = rewire('../DataStore');


describe("DataStore", function () {
  
  it("should be an object", function (done) {
    expect(typeof DataStore).toEqual('object');
    done();
  });
  
  it("should have a addChangeListener function", function (done) {
    expect(typeof DataStore.addChangeListener).toEqual('function');
    done();
  });

  it("should have a removeChangeListener function", function (done) {
    expect(typeof DataStore.removeChangeListener).toEqual('function');
    done();
  });
  
  it("should have a getData and setData function", function (done) {
    expect(typeof DataStore.getData).toEqual('function');
    expect(typeof DataStore.setData).toEqual('function');
    done();
  });
  
  it("should remove stored data on user logout", function (done) {
    DataStore.setData([{1:'a'}, {2:'b'}, {3:'c'}], "Utility");

    expect(DataStore.getData("Utility")[0][1]).toEqual('a');

    DataStore.logoutUser();

    expect(DataStore.getData("Utility").length).toEqual(1);
    done();
  });
  

});