var React = require('react');
var d3 = require('d3');

// Actions
var ViewActions = require('./../actions/ViewActions');

// Store
var DataStore = require('./../stores/DataStore');

// Root View
var LineGraphView = React.createClass({

  // React Functions /////////////////////////////////

  getInitialState: function() {
    return {
      data: {
        'Watt': [{}],
        'Utility': [{}]
      }
    };
  },

  loadData: function() {
    this.setState({data: DataStore.getData()});
  },

  componentDidMount: function() {
    DataStore.addChangeListener(this.loadData);
    ViewActions.loadWatt()
    .then(ViewActions.loadUtility)
    .catch(function(err) {
      console.log("ERROR: ", err);
    });
  },

  componentDidUpdate: function() {
    var el = React.findDOMNode(this);
    console.log(this.state.data.Watt);
    this.createGraph(el, {
      width: '1000',
      height: '500',
      margin: '10'
    }, this.state);
    //this.testGraph(el);
  },

  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.loadData);
  },

  render: function () {
    return (

      <div className="lineContainer"></div>

    );
  },

  // Class Functions ////////////////////////////////////

  createGraph: function(el, props, state) {
    var data = state.data.Watt;
    var scale = {
      height: parseInt(props.height, 10),
      width: parseInt(props.width, 10),
      margin: parseInt(props.margin, 10)
    };
    var height = parseInt(props.height, 10);
    var width = parseInt(props.width, 10);
    var margin = parseInt(props.margin, 10);

    var graph = d3.select(el).append('svg:svg')
              .attr('class', 'svg')
              .attr('width', scale.width + scale.margin + scale.margin)
              .attr('height', scale.height + scale.margin + scale.margin)
              .append('svg:g')
                .attr('transform', 'translate(' + (scale.margin) + ',' + (scale.margin) + ')');

    this.createScale(graph, scale, data);
  },

  createScale: function(graph, scale, data) {

    // Addtional parameters we need to calculate to create the x and y axis and pass to draw the line
    scale.axisOffset = 50;
    scale.yRange = d3.scale.linear().domain([0, 2000]).range([scale.height-100, 0]);
    scale.xRange = d3.scale.linear().domain([0, data.length]).range([0, scale.width-100]);

    var xAxis = d3.svg.axis().scale(scale.xRange);

    var yAxis = d3.svg.axis().scale(scale.yRange).orient('left');

    graph.append('svg:g')
    .attr('class', 'x Axis')
    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.height - scale.axisOffset) + ')')
    .call(xAxis);

    graph.append('svg:g')
    .attr('class', 'y Axis')
    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.axisOffset) + ')')
    .call(yAxis);


    this.drawGraph(graph, scale, data);
  },

  drawGraph: function(graph, scale, data) {

    var lineFunc = d3.svg.line()
                    .x(function(datum, i) {
                      return scale.xRange( i );
                    })
                    .y(function(datum) {
                      return scale.yRange( parseInt(datum.carbon) );
                    })
                    .interpolate('linear');

    graph.append('svg:path')
    .attr('d', lineFunc(data))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('transform', 'translate(' + (scale.axisOffset) + ', 0)' );
  },

  testGraph: function(el) {
    var m = [80, 80, 80, 80]; // margins
    var w = 1000 - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height
    
    // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
    var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];

    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
      // automatically determining max range can work something like this
      // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

    // create a line function that can convert data[] into x and y points
    var line = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d,i) { 
        // verbose logging to show what's actually being done
        console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
        // return the X coordinate where we want to plot this datapoint
        return x(i); 
      })
      .y(function(d) { 
        // verbose logging to show what's actually being done
        console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
        // return the Y coordinate where we want to plot this datapoint
        return y(d); 
      })

    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select(el).append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // create yAxis
    var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);


    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(-25,0)")
          .call(yAxisLeft);
    
    // Add the line by appending an svg:path element with the data line we created above
    // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr("d", line(data));
  }

});

module.exports = LineGraphView;