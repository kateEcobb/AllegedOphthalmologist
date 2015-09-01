var d3 = require('d3');
var utils = require('../utils/dataUtils.js');
var GraphType = require('../constants/Constants.js').GraphTypes;

// MAIN CHARTS ///////////////////////////////////////////////
/*
  Values to pass to props
  type:     String  - Optional - type of graph you want, defaults to main watt emissions
  height:   Number  - Required - Height of the graph element
  width:    Number  - Required - Width of the graph element
  margin:   Number  - Optional - Margin around the graph element
  ratio:    boolean - Optional - Specific case of whether you want to ratio user power by watt carbon emissions 
  overlay:  String  - Optional - Name of state data that you want to overlay on top of
*/
var graph = function(el, props, state) {
  var parsedState = utils.parseState(state);
  var options = initGraph(el, props, parsedState);
  drawAxis(options);
  drawLine(options);
}
//////////////////////////////////////////////////////////////

var initGraph = function(el, props, parsedState) {
  var options = {};
  var data;
  var graphType = props.type || GraphType.MAIN;

  // DATA ===============================
  switch(graphType) {
    case GraphType.MAIN:
      data = options.data = parsedState.Watt;
      break;
    case GraphType.USER_KWH:
      data = options.data = parsedState.Utility;
      options.overlay = 'Watt';
      break;
    case GraphType.USER_CARBON:
      data = options.data = parsedState.Utility;
      break;
    default:
      break;
  }

  // SCALE ==============================
  var scale = options.scale = {
    height: parseInt(props.height, 10),
    width: parseInt(props.width, 10),
    margin: props.margin ? parseInt(props.margin, 10) : 10,
    axisOffset: 50, 
    yMinRatio: 0.95,
    yMaxRatio: 1.02,
    ratio: props.ratio || false,
    orient: options.overlay ? 'right' : 'left',
  };

  // Set up the yRange
  scale.yRange = d3.scale.linear().domain([d3.min(data, function(datum) {
    return datum.point * scale.yMinRatio * (scale.ratio ? datum.ratio : 1);
  }), d3.max(data, function(datum) {
    return datum.point * scale.yMaxRatio * (scale.ratio ? datum.ratio : 1);
  })]).nice()
  .range([scale.height - scale.axisOffset - scale.axisOffset, 0]);

  // Set up the xRange - Time Scale
  scale.xRange = d3.time.scale.utc().domain([ 
    (options.overlay ? parsedState[options.overlay][0].time : data[0].time), 
    (options.overlay ? parsedState[options.overlay][parsedState[options.overlay].length - 1].time : data[data.length - 1].time)
  ])
  .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

  // GRAPH ==============================
  var graph = options.graph = d3.select(el).append('svg:svg')
                              .attr('class', 'eneryGraph')
                              .attr('width', scale.width + scale.margin + scale.margin)
                              .attr('height', scale.height + scale.margin + scale.margin)
                            .append('svg:g')
                              .attr('transform', 'translate(' + (scale.margin) + ',' + (scale.margin) + ')');

  return options;
};

var drawAxis = function(options) {

  var graph = options.graph;
  var scale = options.scale;

  // Set up and draw the Y Axis
  var yAxis = d3.svg.axis().scale(scale.yRange).orient(scale.orient);
  graph.append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + ( options.overlay ? scale.width - scale.axisOffset : scale.axisOffset ) + ',' + (scale.axisOffset) + ')')
  .call(yAxis);

  // Set up and draw the X Axis if this is not a overlay
  if (!options.overlay) {
    var xAxis = d3.svg.axis().scale(scale.xRange);
    graph.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.height - scale.axisOffset) + ')')
    .call(xAxis);
  }

};

var drawLine = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data  = options.data;

  // Define the Line that the Path will take
  var lineFunc = d3.svg.line()
                  .x(function(datum) {
                    return scale.xRange( datum.time );
                  })
                  .y(function(datum) {
                    return scale.yRange( datum.point * (scale.ratio ? datum.ratio : 1) );
                  })
                  .interpolate('basis');

  // Draw the Path
  graph.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('class', 'energyPath')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.axisOffset) + ')');

  return;
};

var drawPoints = function(options) {
  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Define the graph the points will sit in
  var pointGraph = graph.append('svg:g')
                    .attr('class', 'pointGraph')
                    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.axisOffset) + ')');

  // DATA JOIN //
  var points = pointGraph.selectAll('circle')
                .data(data, function(datum) {return datum.id;});

  // UPDATE //

  // ENTER //
  points.enter().append('circle')
  .attr('class', 'linePoint')
  .attr('cx', function(datum) {
    return scale.xRange( datum.time ); 
  })
  .attr('cy', function(datum) {
    return scale.yRange( datum.point ); 
  });

  // UPDATE + ENTER //

  // EXIT //
  points.exit().remove();

  return;
};

module.exports = {
  graph: graph,
}