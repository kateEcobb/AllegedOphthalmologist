var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var TestUtils = require('react/lib/ReactTestUtils');

var rewire = require('rewire');

// var AppView = rewire('../../app.jsx');
var dialogWindow = rewire('../../app/js/components/dialogWindow.jsx')
var NavMenu = rewire('../../app/js/components/NavMenu.jsx');
var MainView = rewire('../../app/js/components/MainView.jsx');
var LoginView = rewire('../../app/js/components/LoginView.jsx');
var ProfileView = rewire('../../app/js/components/ProfileView.jsx');
var RegistrationView = rewire('../../app/js/components/RegistrationView.jsx');
var engergyBreakDown = rewire('../../app/js/components/energyBreakDownView.jsx');
var AboutUs = rewire('../../app/js/components/AboutUs.jsx');




describe('View', function(){

  var router = function(instance, callback){
    var routes = <Route path='test' handler={instance} />
    
    var div = document.createElement('div');

    Router.run(routes, '/test', function(instance){
      var component = React.render(<instance />, div);
      callback(component);
    });
  }

  afterEach(function(done){
    React.unmountComponentAtNode(document.body);
    document.body.innerHTML = '';
    done();
  })

  xit('should render App view', function(){
    var div = document.createElement('div');
    div.setAttribute('id', 'AppView');
    var element = TestUtils.renderIntoDocument(<AppView />);
    expect(element).toBeTruthy();
  });

  it('should render dialogWindow view', function(done){
    var element = TestUtils.renderIntoDocument(<dialogWindow />);
    expect(element).toBeTruthy();
    done();
  });

  it('should render engergyBreakDown view', function(done){
    var element = TestUtils.renderIntoDocument(<engergyBreakDown />);
    expect(element).toBeTruthy();
    done();
  });

  it('should render ProfileView view', function(done){

    var cb = function(instance){
      expect(instance).toBeTruthy();
      done();
    }
    router(ProfileView, cb);
  });

  it('should render MainView view', function(done){
    var cb = function(instance){
      expect(instance).toBeTruthy();
      done();
    }
    router(MainView, cb);

  });

  it('should render ProfileView view', function(done){
    var cb = function(instance){
      expect(instance).toBeTruthy();
      done();
    }
      
    router(ProfileView, cb);
  });

  it('should render AboutUs view', function(done){
    var cb = function(instance){
      expect(instance).toBeTruthy();
      done();
    }

    router(AboutUs, cb);
  });

  it('should render LoginView view', function(){
    // var element = TestUtils.renderIntoDocument(<LoginView />);
    var cb = function(instance){
      expect(instance).toBeTruthy();
    }

    router(LoginView, cb);
  });

  it('should render RegistrationView view', function(){
    var cb = function(instance){
      expect(instance).toBeTruthy();
    }

    router(RegistrationView, cb);
  });

  

});

