var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

// Form validation
var Formsy = require('formsy-react');
var FormInput = require('./FormInput.jsx');

// Material UI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Avatar = mui.Avatar;
var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardText = mui.CardText;
var CardActions = mui.CardActions;
var FlatButton = mui.FlatButton;
var Paper = mui.Paper;
var Tabs = mui.Tabs;
var Tab = mui.Tab;

//Stores
var UserStore = require('./../stores/UserStore');

var ProfileView = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getInitialState: function() {
    return {
      user: {
        name: UserStore.getAccountAuth()
      },
      data: {
        utilityData: null
      }
    };
  },

  submitForm: function(data) {
    console.log("Form submitted with: ", data);
  },

  enableButton: function () {
    this.setState({
      canSubmit: true
    });
  },
  disableButton: function () {
    this.setState({
      canSubmit: false
    });
  },

  render: function (){
    return(
      <div className="container">
        <Tabs>
        <Tab label="Account Summary">
          <Card initiallyExpanded={true}>
            <CardHeader
              title={this.state.user.name}
              avatar={<Avatar style={{color:'red'}}>{this.state.user.name ? this.state.user.name[0] : null}</Avatar>}
              showExpandableButton={false}>
            </CardHeader>
          </Card>
        </Tab>
        <Tab label="Update PG&E Info.">
          <Paper className="update-pge-form" zDepth={2}>
            <Formsy.Form onSubmit={this.submitForm} onValid={this.enableButton} onInvalid={this.disableButton}>
              <FormInput name="username" title="Email" type="text" 
                validations="isEmail" validationError="Please enter a valid email" required/>
              <FormInput name="password" title="Password" type="password" 
                validations="minLength:6" validationError="Password must be at least 6 characters in length"/>
            <FlatButton className="btn btn-submit" type="submit" disabled={!this.state.canSubmit}>Login</FlatButton>
            </Formsy.Form>
          </Paper>
          
          <div className="spinner-container">
            <div className="spinner-loader">Loading…</div>
          </div>

        </Tab>
        </Tabs>

      </div>
    );
  }
});




module.exports = ProfileView;