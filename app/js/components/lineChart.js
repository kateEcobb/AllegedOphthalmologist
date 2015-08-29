var d3 = require('d3')

// MAIN ///////////////////////////////////////////////////////////////////////////
var createChart = function(el, props, state) {
  var options = initGraph(el, props, state);
  drawAxes(options);
  drawLine(options);
  drawPoints(options);
};
///////////////////////////////////////////////////////////////////////////////////

// Helper Functions

// Sets up the graph options object that will be passed to the other helper functions
// returns Object{graph, scale, data}
var initGraph = function(el, props, state) {
  var options = {};

  // DATA ////////////////
  var data = options.data = [];
  // Parse state to obtain required data
  for (var i = 0; i < state.data.Watt.length; i++) {
    data.push({
      carbon: parseInt(state.data.Watt[i].carbon),
      time: new Date(state.data.Watt[i].timestamp),
      id: state.data.Watt[i]._id
    });
  }
  // Sort data by timestamp
  data.sort(function(a, b) {
    return a.time - b.time;
  });

  // SCALE //////////////
  // Initial parameters
  var scale = options.scale = {
    height: parseInt(props.height, 10),
    width: parseInt(props.width, 10),
    margin: parseInt(props.margin, 10),
    axisOffset: 50,
    yMaxRatio: 1.05,
  };

  // Set up the scale yRange
  scale.yRange = d3.scale.linear().domain([d3.min(data, function(datum) {
    return datum.carbon;
  }), d3.max(data, function(datum) {
    return datum.carbon * scale.yMaxRatio;  
  })])
  .range([scale.height - scale.axisOffset - scale.axisOffset, 0]);

  // Set up the scale xRange
  scale.xRange = d3.time.scale.utc().domain([data[0].time, data[data.length - 1].time])
  .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

  // GRAPH //////////////
  var graph = options.graph = d3.select(el).append('svg:svg')
                              .attr('class', 'lineGraph')
                              .attr('width', scale.width + scale.margin + scale.margin)
                              .attr('height', scale.height + scale.margin + scale.margin)
                            .append('svg:g')
                              .attr('transform', 'translate(' + (scale.margin) + ',' + (scale.margin) + ')');

  return options;
};

var drawAxes = function(options) {
  var graph = options.graph;
  var scale = options.scale;

  var xAxis = d3.svg.axis().scale(scale.xRange);
  var yAxis = d3.svg.axis().scale(scale.yRange).orient('left');

  graph.append('svg:g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.height - scale.axisOffset) + ')')
  .call(xAxis);

  graph.append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.axisOffset) + ')')
  .call(yAxis);

  return;
};

var drawLine = function(options) {
  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var lineFunc = d3.svg.line()
                  .x(function(datum, i) {
                    return scale.xRange( datum.time );
                  })
                  .y(function(datum) {
                    return scale.yRange( datum.carbon );
                  })
                  .interpolate('linear');

  graph.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('class', 'linePath')
  .attr('transform', 'translate(' + (scale.axisOffset) + ', 0)' );

  return;
};

var drawPoints = function(options) {
  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var pointGraph = graph.append('svg:g')
                    .attr('class', 'pointGraph')
                    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (0) + ')');

  // DATA JOIN
  var points = pointGraph.selectAll('circle')
                .data(data, function(datum) {return datum.id;});

  // DATA UPDATE

  // ENTER
  points.enter().append('circle')
  .attr('class', 'linePoint')
  .attr('cx', function(datum) {
    return scale.xRange( datum.time ); 
  })
  .attr('cy', function(datum) {
    return scale.yRange( datum.carbon ); 
  });

  // EXIT
  points.exit().remove();

  return;
};


module.exports = {
  createChart: createChart,
};