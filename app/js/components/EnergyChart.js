var d3 = require('d3');
var utils = require('../utils/dataUtils.js');
var GraphTypes = require('../constants/Constants.js').GraphTypes;

// MAIN CHARTS ///////////////////////////////////////////////
/*
  Values to pass to props
  type:     String  - Optional - type of graph you want, defaults to main watt emissions, check Constants for names
  height:   Number  - Required - Height of the graph element
  width:    Number  - Required - Width of the graph element
  margin:   Number  - Optional - Margin around the graph element
  barWidth: Number  - Optional - Width of any Time Bars, defaults to 10
  ratio:    boolean - Optional - Specific case of whether you want to ratio user power by watt carbon emissions 
  overlay:  String  - Optional - Name of state data that you want to overlay on top of
*/
var graph = function(el, props, state) {
  var parsedState = utils.parseState(state);
  var options = initGraph(el, props, parsedState);
  drawAxis(options);
  if (!options.userDisable) {
    drawLine(options);
    drawMiscData(options);
    // drawTimeBar(options);
    drawCapturePad(options);
  }
  else {
    drawDisablePad(options);
  }
};
//////////////////////////////////////////////////////////////

var initGraph = function(el, props, parsedState) {
  var options = {};
  var data;
  options.graphType = props.type || GraphTypes.MAIN;

  // DATA ===============================
  switch(options.graphType) {
    case GraphTypes.USER_REQUIRE:
      data = options.data = parsedState.Watt;
      options.userDisable = true;
      break;
    case GraphTypes.MAIN:
      data = options.data = parsedState.Watt;
      options.unit = "lbs/Mwh";
      break;
    case GraphTypes.USER_CARBON:
      data = options.data = parsedState.Utility;
      options.overlay = 'Watt';
      break;
    case GraphTypes.USER_MWH:
      data = options.data = parsedState.Utility;
      options.unit = 'Mwh';
      break;
    default:
      break;
  }

  // SCALE ==============================
  var scale = options.scale = {
    height: parseInt(props.height, 10),
    width: parseInt(props.width, 10),
    margin: props.margin ? parseInt(props.margin, 10) : 10,
    barWidth: parseFloat(props.barWidth) || 3,
    axisOffset: 50, 
    yMinRatio: 0.95,
    yMaxRatio: 1.02,
    ratio: props.ratio || false,
    orient: options.overlay ? 'right' : 'left',
    headerOffset: 10,
  };

  // Set up the yRange
  scale.yRange = d3.scale.linear().domain([d3.min(data, function(datum) {
    return datum.point * scale.yMinRatio * (scale.ratio ? datum.ratio : 1);
  }), d3.max(data, function(datum) {
    return datum.point * scale.yMaxRatio * (scale.ratio ? datum.ratio : 1);
  })]).nice()
  .range([scale.height - scale.axisOffset - scale.headerOffset, 0]);

  // Set up the xRange - Time Scale
  scale.xRange = d3.time.scale().domain([ 
    (options.overlay ? parsedState[options.overlay][0].time : data[0].time), 
    (options.overlay ? parsedState[options.overlay][parsedState[options.overlay].length - 1].time : data[data.length - 1].time)
  ])
  .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

  // GRAPH ==============================
  var graph = options.graph = d3.select(el).append('svg:svg')
                              .attr('class', 'energyGraph')
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
  .attr('transform', 'translate(' + ( options.overlay ? scale.width - scale.axisOffset : scale.axisOffset ) + ',' + (scale.headerOffset) + ')')
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
                  .interpolate('linear');

  // Draw the Path
  graph.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('class', 'energyPath')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.headerOffset) + ')')
  // .on('mousemove', function(event) {
  //   var mouse = d3.mouse(this);
  //   d3.select('.energyPath').select('title').text(mouse[1]);
  // })
  // .append('title');

  return;
};

var drawPoints = function(options) {
  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Define the graph the points will sit in
  var pointGraph = graph.append('svg:g')
                    .attr('class', 'pointGraph')
                    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.headerOffset) + ')');

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

var drawTimeBar = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // var timeOffset = ((new Date()).getTimezoneOffset() * 1000 * 60);
  var timeNow = new Date(Date.now());

  // var actualX = scale.xRange(new Date(findActualTime(data).getTime() + timeOffset));
  // var actualTime = new Date(findActualTime(data).getTime() + ((new Date()).getTimezoneOffset() * 1000 * 60));
  // var actualX = scale.xRange(actualTime[0]);

  // graph.append('svg:g')
  // .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (0) + ')')
  //   .append('svg:rect')
  //   .attr('class', 'actualTimeBar')
  //   .attr('height', scale.height - scale.axisOffset)
  //   .attr('width', scale.barWidth)
  //   .attr('x', actualX - scale.barWidth / 2)
  //   .attr('y', 0);

  // graph.append('svg:circle')
  // .attr('transform', utils.translate(scale.axisOffset, 0))
  // .attr('class', 'predictPoint')
  // .attr('x', scale.xRange())

  var currentX = scale.xRange(timeNow);

  graph.append('svg:g')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.headerOffset) + ')')
    .append('svg:rect')
    .attr('class', 'currentTimeBar')
    .attr('height', scale.height - scale.axisOffset - scale.headerOffset)
    .attr('width', scale.barWidth)
    .attr('x', currentX - scale.barWidth / 2)
    .attr('y', 0);

};

var drawPredictPoint = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var predictIndex = findDAHRIndex(data);
  // Test for invalid index, if we have empty dataset
  if (predictIndex === -1) {
    throw new Error();
  }
  
  graph.append('svg:circle')
  .attr('class', 'predictPoint')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .attr('cx', scale.xRange(data[predictIndex].time))
  .attr('cy', scale.yRange(data[predictIndex].point));
};

// THIS MIGHT BE DEPRECATED //////////////////
// var drawActualPredictText = function(options) { 

//   var graph = options.graph;
//   var scale = options.scale;
//   var data = options.data;

//   var actualTime = new Date(findActualTime(data).getTime() + ((new Date()).getTimezoneOffset() * 1000 * 60));
//   var actualX = scale.xRange(actualTime[0]);

//   // Actual
//   graph.append('svg:g')
//   .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (0) + ')')
//     .append('svg:text')
//     .attr('class', 'actualText')
//     .attr('x', (actualX - scale.axisOffset - scale.axisOffset) / 2)
//     .attr('y', scale.axisOffset / 2)
//     .text('Measured Data');

//   // Predicted
//   graph.append('svg:g')
//   .attr('transform', 'translate(' + (actualX + scale.axisOffset) + ',' + (0) + ')')
//     .append('svg:text')
//     .attr('class', 'predictedText')
//     .attr('x', (scale.width - scale.axisOffset - scale.axisOffset - scale.axisOffset - actualX) / 2)
//     .attr('y', scale.axisOffset / 2)
//     .text('Predicted Data');
  
// };

var drawDisablePad = function(options) {

  var graph = options.graph;
  var scale = options.scale;

  graph.append('svg:rect')
  .attr('transform', utils.translate(-scale.margin, -scale.margin))
  .attr('class', 'disablePad')
  .attr('width', scale.width + scale.margin + scale.margin)
  .attr('height', scale.height + scale.margin + scale.margin);

};

var drawMiscData = function(options) {

  if (options.graphType === GraphTypes.MAIN) {
    drawTimeBar(options);
    drawPredictPoint(options);

  }
};

var drawCapturePad = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Draw the focus
  var focus = graph.append('svg:g')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.headerOffset) + ')')
  .style('display', 'none');

  // Attach elements to focus ===================================
  focus.append('svg:circle')
  .attr('class', 'focal')
  .style('fill', 'none')
  .style('stroke', 'blue')
  .attr('r', 5);

  focus.append('svg:line')
  .attr('class', 'focusXLine')
  .attr('y1', 0)
  .attr('y2', scale.height - scale.axisOffset - scale.headerOffset);

  focus.append('svg:line')
  .attr('class', 'focusYLine')
  .attr('x1', 0)
  .attr('x2', scale.width - scale.axisOffset - scale.axisOffset);  

  focus.append('svg:text')
  .attr('class', 'focusData highlight')
  .attr('dy', '-3rem');
  focus.append('svg:text')
  .attr('class', 'focusData info')
  .attr('dy', '-3rem');
  
  focus.append('svg:text')
  .attr('class', 'focusDate highlight')
  .attr('dy', '-1rem');
  focus.append('svg:text')
  .attr('class', 'focusDate info')
  .attr('dy', '-1rem');
  
  var mouseMove = function() {

    var mouseDate = scale.xRange.invert(d3.mouse(this)[0]);
    var mousePos = d3.mouse(this);

    // Calculate get the index right before the mouse date and then find whether left or right is closer
    var index = utils.bisectDateIndex(data, mouseDate);
    var nearestDatum = (mouseDate - data[index].time > data[index + 1].time - mouseDate) ? data[index + 1] : data[index];

    var x = scale.xRange(nearestDatum.time);
    var y = scale.yRange(nearestDatum.point * (scale.ratio ? nearestDatum.ratio : 1));

    // Calculate dx based on how far along the graph we are;
    var textAnchor = (x / (scale.width - scale.axisOffset - scale.axisOffset)) < 0.88 ? 'start' : 'end';

    // Update the position of all the focus elements
    focus.select('.focal')
    .attr('transform', 'translate(' + (x) + ',' + (y) + ')');  

    focus.select('.focusXLine')
    .attr('transform', 'translate(' + (x) + ',' + (y) + ')')
    .attr('y2', scale.height - scale.axisOffset - scale.headerOffset - y);

    focus.select('.focusYLine')
    .attr('transform', 'translate(' + (0) + ',' + (y) + ')');  

    focus.select('.focusData.highlight')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .text( (Math.round((nearestDatum.point + 0.00001) * 100) / 100) + ' ' + options.unit);

    focus.select('.focusData.info')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .text( (Math.round((nearestDatum.point + 0.00001) * 100) / 100) + ' ' + options.unit);

    focus.select('.focusDate.highlight')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .text( utils.formatFocusDate(nearestDatum.time) );

    focus.select('.focusDate.info')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .text( utils.formatFocusDate(nearestDatum.time) );

  };

  // Draw the Surface
  graph.append('svg:rect')
  .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.headerOffset) + ')')
  .attr('width', scale.width - scale.axisOffset - scale.axisOffset)
  .attr('height', scale.height - scale.axisOffset - scale.headerOffset)
  .style('fill', 'none')
  .style('pointer-events', 'all')
  .on('mouseover', function() { 
    focus.style('display', null); })
  .on('mouseout', function() { 
    focus.style('display', 'none'); })
  .on('mousemove', mouseMove);

};

//////

var findDAHRIndex = function(data) {
  if (!data[0].market) {
    return -1;
  }
  for (var i = 0; i < data.length; i++) {
    if (data[i].market === 'DAHR') {

      return i;
    }
  }
  return data.length - 1;
};

module.exports = {
  graph: graph,
};