var React = require('react');
var Pie = require('./pieChart');

var data = [
  { quantity: 2000 },
  { quantity: 7000 },
  { quantity: 6000 }
];

// Red
var colorRange = ['#A60F2B','#e6e600','#528C18'];

var UserPieChartView = React.createClass({

  render: function() {
    return (
      <Pie colorRange={colorRange} data={data} width={500} height={500} />
    );
  }

});

module.exports = UserPieChartView;