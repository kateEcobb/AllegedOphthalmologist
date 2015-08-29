var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

// Material UI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Avatar = mui.Avatar;
var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardText = mui.CardText;
var CardActions = mui.CardActions;
var FlatButton = mui.FlatButton;

//Stores
var UserStore = require('./../stores/UserStore');

var ProfileView = React.createClass({
  // Use a bit of two way data binding because forms are a pain otherwise.
  mixins: [Router.Navigation],

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
        username: UserStore.getUsername()
      },
      data: {
        utilityData: null
      }
    };
  },

  render: function (){
    return(
      <Card initiallyExpanded={true}>
        <CardHeader
          title={this.state.user.username}
          subtitle="Subtitle"
          avatar={<Avatar style={{color:'red'}}>{this.state.user.username ? this.state.user.username[0] : null}</Avatar>}
          showExpandableButton={false}>
        </CardHeader>
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </Card>
    );
  }
});

module.exports = ProfileView;