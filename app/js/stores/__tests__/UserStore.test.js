const rewire = require("rewire");

var UserStore = rewire('../UserStore');


describe("UserStore", function () {
  
  it("should be an object", function (done) {
    expect(typeof UserStore).toEqual('object');
    done();
  });
  
  it("should have a addChangeListener function", function (done) {
    expect(typeof UserStore.addChangeListener).toEqual('function');
    done();
  });

  it("should have a removeChangeListener function", function (done) {
    expect(typeof UserStore.removeChangeListener).toEqual('function');
    done();
  });
  
  it("should have a setData function", function (done) {
    var data = {
      username : 'bill',
      account_auth : 1234,
      PGE_username : 'billy-bob',
      account_uid : 5678,
      service_uid : 1425,
      utility_service_address : '1234 lane',
      token : 21354,
    }
    UserStore.setUser(data);

    expect(UserStore.getUsername()).toBe('bill');
    done();
  });
  
  it("should have a logoutUser function", function (done) {
    // var actions = [
    //   UserStore.getUser,
    //   UserStore.getUsername,
    //   UserStore.getServiceUid,
    //   UserStore.getAccountAuth,
    //   UserStore.getPGEUsername,
    //   UserStore.getAccountUid,
    //   UserStore.getServiceAddress,
    //   UserStore.getToken,
    // ]

    var data = {
      username : 'bill',
      account_auth : 1234,
      PGE_username : 'billy-bob',
      account_uid : 5678,
      service_uid : 1425,
      utility_service_address : '1234 lane',
      token : 21354,
    }
    UserStore.setUser(data);
    expect(UserStore.getUsername()).toBe('bill');

    UserStore.logoutUser();
    expect(UserStore.getUsername()).toBe(null);
    done();
  });
  
});