var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var TestUtils = require('react/lib/ReactTestUtils');
var shallowRenderer = TestUtils.shallowRenderer;

var rewire = require('rewire');

var LoginView = rewire('../../app/js/components/LoginView.jsx');
var FormInput = rewire('../../app/js/components/FormInput.jsx');


describe('Login', function(){

  var router = function(instance, callback){
    var routes = <Route path='test' handler={instance} />
    
    var div = document.createElement('div');

    Router.run(routes, '/test', function(instance){
      var component = TestUtils.renderIntoDocument(<instance />, div);
      callback(component);
    });
  }

  // beforeEach (function(done){
  //   var login = router(LoginView, function(instance){ return instance });
  //   // var sumbit = TestUtils.findRenderedDOMComponentWithTag(login, 'FlatButton');
  //   done();
  // })

  it('should require that email is valid', function(done){
    var cb = function(component){
      var login = React.findDOMNode(component);
      var inputs = TestUtils.scryRenderedDOMComponentsWithClass(component, 'form-group');
      console.log(inputs.length);
      expect(inputs).toBeDefined();
      done();
    }
    router(LoginView, cb);
  });

  xit('should validate the password before accepting', function(){

  });

  xit('should submit form on button click', function(){

  });
})