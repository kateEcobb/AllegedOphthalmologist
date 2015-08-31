var d3 = require('d3');
var dataUtil = require('../utils/dataUtils.js');

// MAIN ///////////////////////////////////////////////////
var createChart = function(el, props, state) {
  var data = dataUtil.parseData(state);
  var options = initGraph(el, props, data);
  drawAxes(options);
  drawLine(options);
  //drawPoints(options);
  return options.graph;
};
///////////////////////////////////////////////////////////

// Sets up the graph options object that will be passed along
// returns Object{ graph, scale, data}
var initGraph = function(el, props, data) {
  var options = {};

  // DATA ///////////////////////////
  options.data = data.Utility;

  // SCALE //////////
  var scale = options.scale = {
    height: parseInt(props.height, 10),
    width: parseInt(props.width, 10),
    margin: parseInt(props.margin, 10),
    axisOffset: 50,
    yMinRatio: 0.95,
    yMaxRatio: 1.02,
  };

  scale.yRange = d3.scale.linear().domain([d3.min(data.Utility, function(datum) {
    return datum.power * datum.ratio * scale.yMinRatio;
  }), d3.max(data.Utility, function(datum) {
    return datum.power * datum.ratio * scale.yMaxRatio;
  })])
  .range([scale.height - scale.axisOffset - scale.axisOffset, 0]);

  scale.xRange = d3.time.scale.utc().domain([data.Watt[0].time, data.Watt[data.Watt.length - 1].time])
  .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

  // GRAPH //////////
  var graph = options.graph = d3.select(el).append('svg:svg')
                              .attr('class', 'userLineGraph')
                              .attr('width', scale.width + scale.margin + scale.margin)
                              .attr('height', scale.height + scale.margin + scale.margin)
                            .append('svg:g')
                              .attr('transform', 'translate(' + (scale.margin) + ',' + (scale.margin) + ')');
  return options;
};

var drawAxes = function(options) {
  var graph = options.graph;
  var scale = options.scale;

  var yAxis = d3.svg.axis().scale(scale.yRange).orient('right');

  graph.append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + (scale.width - scale.axisOffset) + ',' + (scale.axisOffset) + ')')
  .call(yAxis);

  return;
};

var drawLine = function(options) {
  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Define the line that the path will take
  var lineFunc = d3.svg.line()
                  .x(function(datum) {
                    return scale.xRange( datum.time );
                  })
                  .y(function(datum) {
                    return scale.yRange( datum.power * datum.ratio );
                  })
                  .interpolate('linear');

  // Draw the path
  graph.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('class', 'userLinePath')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.axisOffset) + ')');

  return;
};

var drawPoints = function(options) {
  return;
};

module.exports = {
  createChart: createChart,
}