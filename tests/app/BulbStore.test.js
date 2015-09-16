const rewire = require("rewire");

var BulbStore = rewire('../../app/js/stores/BulbStore');


describe("BulbStore", function () {
  
  it("should be an object", function (done) {
    expect(typeof BulbStore).toEqual('object');
    done();
  });
  
  it("should have a addChangeListener function", function (done) {
    expect(typeof BulbStore.addChangeListener).toEqual('function');
    done();
  });

  it("should have a removeChangeListener function", function (done) {
    expect(typeof BulbStore.removeChangeListener).toEqual('function');
    done();
  });
  
  it("should have a setData function", function (done) {
    expect(typeof BulbStore.setData).toEqual('function');
    done();
  });
  
  it("should have a getData function", function (done) {
    var data = {test: 'this is a test'};
    BulbStore.setData(data);
    expect(BulbStore.getData().test).toBeDefined();
    done();
  });

});