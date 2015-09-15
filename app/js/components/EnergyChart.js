var d3 = require('d3');
var utils = require('../utils/dataUtils.js');
var GraphTypes = require('../constants/Constants.js').GraphTypes;

////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN CHARTS /////////////////////////////////////////////////////////////////////////////////
/*
  == Values to pass to props object ===================================
  type:     String  - Optional - type of graph you want, defaults to main watt emissions, check Constants for names
  height:   Number  - Required - Height of the graph element
  width:    Number  - Required - Width of the graph element
  margin:   Number  - Optional - Margin around the graph element
  barWidth: Number  - Optional - Width of any Time Bars, defaults to 10 
  --DEPRECATED---------------
  overlay:  String  - Optional - Name of state data that you want to overlay on top of
  =====================================================================

  Call graph function to utilize
*/
var graph = function(el, props, state) {

  var options = initGraph(el, props, state);

  // Run the Tasks needed to draw each function
  options.tasks.forEach(function(task) {
    task(options);
  });
};

module.exports = {
  graph: graph, 
};

// Uses the given element, props object and react state to initialize the graph element and create the options
// object that must be passed to a draw function.
var initGraph = function(el, props, state) {
  var options = {};
  var data;
  options.graphType = props.type || GraphTypes.MAIN;

  // DATA ===============================================================================
  switch(options.graphType) {

    // Main Graph Types
    case GraphTypes.MAIN:
      data = options.data = utils.parseWattData(state, false);
      options.unit = "lbs/Mwh";
      options.range = 5;
      options.tasks = [drawLine, drawAxis, drawMiscData, drawAxisScale, drawCapturePad];
      break;

    case GraphTypes.USER_CARBON:
      data = options.data = utils.parseUserCarbonData(state);
      options.unit = 'lbs';
      options.range = 10;
      options.tasks = [drawLine, drawAxis, drawAxisScale, drawCapturePad];
      break;

    case GraphTypes.USER_KWH:
      data = options.data = utils.parseUserKwhData(state);
      options.data2 = utils.parseWattData(state, false);
      options.unit = 'Kwh';
      options.range = 5;
      options.tasks = [drawDangerZone, drawLine, drawAxis, drawAxisScale, drawCapturePad];
      break;

    // Supplemental Graph Types
    case GraphTypes.USER_REQUIRE:
      data = options.data = utils.parseWattData(state);
      options.range = 5;
      options.tasks = [drawAxis, drawAxisScale, drawDisablePad];
      break;

    default:
      break;
  }

  // SCALE ================================================================================
  var scale = options.scale = {
    height: parseInt(props.height, 10),
    width: parseInt(props.width, 10),
    margin: props.margin ? parseInt(props.margin, 10) : 10,
    barWidth: parseFloat(props.barWidth) || 2,
    headerOffset: 10,
    footerOffset: 25,
    axisOffset: 40, 
    yMinRatio: 0.95,
    yMaxRatio: 1.02,
    orient: options.overlay ? 'right' : 'left',
  };

  // Set up the initial date range
  var filterDate = new Date(data[data.length - 1].time - (24 * 60 * 60 * 1000) * options.range);
  var filterIndex = utils.bisectDateIndex(data, filterDate);
  scale.range = [data[filterIndex].time, data[data.length - 1].time];

  // Calculate the absolute y range
  scale.yMin = d3.min(data, function(datum) {
    return datum.point * scale.yMinRatio;
  });
  scale.yMax = d3.max(data, function(datum) {
    return datum.point * scale.yMaxRatio;
  });

  // Set up the yRange
  scale.yRange = d3.scale.linear()
  .domain([scale.yMin, scale.yMax]).nice()
  .range([scale.height - scale.headerOffset - scale.footerOffset, 0]);

  // Set up the xRange - Time Scale
  scale.xRange = d3.time.scale()
  .domain([scale.range[0], scale.range[1]])
  .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

  // Define the initial state of the axes
  scale.yAxis = d3.svg.axis().scale(scale.yRange).orient(scale.orient);
  scale.xAxis = d3.svg.axis().scale(scale.xRange);

  // Define the Line Path Function
  scale.line = d3.svg.line()
                .x(function(datum) {
                  return scale.xRange( datum.time );
                })
                .y(function(datum) {
                  return scale.yRange( datum.point );
                })
                .interpolate('monotone');

  // GRAPH ==============================================================================
  var graph = options.graph = d3.select(el).append('svg:svg')
                              .attr('class', 'energyGraph')
                              .attr('width', scale.width + scale.margin + scale.margin)
                              .attr('height', scale.height + scale.margin + scale.margin)
                            .append('svg:g')
                              .attr('transform', utils.translate(scale.margin, scale.margin));

  // Draw the Clip Path for drawing the line
  graph.append('svg:clipPath')
  .attr('id', 'clip')
  .append('svg:rect')
  .attr('width', scale.width - scale.axisOffset - scale.axisOffset)
  .attr('height', scale.height - scale.headerOffset - scale.footerOffset);

  return options;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
// Drawing Functions ///////////////////////////////////////////////////////////////////////////

var drawAxis = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Update the time scale domain
  options.scale.xRange.domain([scale.range[0], scale.range[1]]);

  // Update the point scale domain - we only want to recalculate the y scale if the local max/min is substantially 
  // different from the global max/min
  var localData = data.filter(function(datum) {
    return datum.time >= scale.range[0] && datum.time <= scale.range[1];
  });
  var localMax = d3.max(localData, function(datum) { return datum.point * scale.yMaxRatio; });
  var localMin = d3.min(localData, function(datum) { return datum.point * scale.yMinRatio; });
  options.scale.yRange.domain([
    (scale.yMin / localMin < 0.65) ? scale.yMin * 0.65 : scale.yMin, 
    (localMax / scale.yMax < 0.65) ? scale.yMax * 0.65 : scale.yMax
  ]).nice();

  // Do it the D3 Way /////////////////////////////////////////////

  // DATA JOIN
  var graphYAxis = graph.selectAll('.y.axis')
                    .data([{id:"yaxis"}], function(datum) {return datum.id;});
  var graphXAxis = graph.selectAll('.x.axis')
                    .data([{id:'xaxis'}], function(datum) {return datum.id;});

  // UPDATE 

  // ENTER
  graphYAxis.enter().append('svg:g')
  .attr('class', 'y axis')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset));
  graphXAxis.enter().append('svg:g')
  .attr('class', 'x axis')
  .attr('transform', utils.translate(scale.axisOffset, scale.height - scale.footerOffset));

  // UPDATE + ENTER
  graphYAxis.transition().duration(750).call(scale.yAxis);
  graphXAxis.transition().duration(750).call(scale.xAxis);

  // EXIT
  graphYAxis.exit().remove();
  graphXAxis.exit().remove();
};

var drawLine = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data  = options.data;

  // DATA JOIN //
  var linePath = graph.selectAll('.energyPath')
                  .data([{id:'energyPath'}], function(datum) {return datum.id;});

  // UPDATE //

  // ENTER //
  linePath.enter().append('svg:path')
  .attr('class', 'energyPath')
  .attr('clip-path', 'url(#clip)');

  // UPDATE + ENTER //
  linePath
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .transition().duration(750)
  .attr('d', scale.line(data));

  // EXIT //
  linePath.exit().remove();
};

// Somewhat DEPRECATED as nothing uses it
var drawPoints = function(options) {
  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Define the graph the points will sit in
  var pointGraph = graph.append('svg:g')
                    .attr('class', 'pointGraph')
                    .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset));

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

var drawAxisScale = function(options) {

  var graph = options.graph;
  var scale = options.scale;

  graph.append('svg:text')
  .attr('class', 'axisScale')
  .attr('text-rendering', 'optimizeLegibility')
  .attr('transform', utils.translate(-1, scale.height / 2) + ' rotate(-90)')
  .text(options.unit);
};

var drawTimeBar = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var currentX = scale.xRange(new Date(Date.now()));

  var info = [{x: (currentX - scale.barWidth / 2), id: '1234'}];

  // DATA
  var timeBar = graph.selectAll('.currentTimeBar')
                .data(info, function(datum) {return datum.id;});

  // UPDATE

  // ENTER
  timeBar.enter().append('svg:rect')
  .attr('class', 'currentTimeBar')
  .attr('clip-path', 'url(#clip)')
  .attr('height', scale.height - scale.headerOffset - scale.footerOffset)
  .attr('width', scale.barWidth);

  // UPDATE + ENTER
  timeBar
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .transition().duration(750)
  .attr('y', 0)
  .attr('x', function(datum) {
    return datum.x;
  });

  // EXIT
  timeBar.exit().remove();

  drawTimeBarTitle(options, timeBar, info[0].x);
};

var drawTimeBarTitle = function(options, timeBar, x) {

  var graph = options.graph;
  var scale = options.scale;

  // DATA JOIN //
  var title = graph.selectAll('.timeBarTitle')
              .data([{id:'timeBarTitle'}], function(datum) {return datum.id;});

  // ENTER //
  title.enter().append('svg:text')
  .attr('class', 'timeBarTitle')
  .attr('text-rendering', 'optimizeLegibility')
  .attr('clip-path', 'url(#clip)')
  .attr('y', '1rem')
  .text('Current Time');

  // UPDATE + ENTER //
  title
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .transition().duration(750)
  .attr('x', x - 2);

  // EXIT //
  title.exit().remove();
};

var drawPredictPoint = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var predictIndex = utils.findDAHRIndex(data);

  // Test for invalid index, if we have empty dataset
  if (predictIndex === -1) {
    return;
  }

  var time = scale.xRange(data[predictIndex].time);
  var point = scale.yRange(data[predictIndex].point);
  var info = [{time: time, point: point, id: "1234"}];

  // DATA JOIN
  var predictPoint = graph.selectAll('.predictPoint')
                      .data(info, function(datum) {return datum.id;});

  // UPDATE

  // ENTER
  predictPoint.enter().append('svg:circle')
  .attr('class', 'predictPoint')
  .attr('clip-path', 'url(#clip)');

  // UPDATE + ENTER
  predictPoint
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .transition().duration(750)
  .attr('cx', function(datum) {
    return datum.time;
  })
  .attr('cy', function(datum) {
    return datum.point;
  });

  // EXIT
  predictPoint.exit().remove();
};

var drawDisablePad = function(options) {

  var graph = options.graph;
  var scale = options.scale;

  graph.append('svg:rect')
  .attr('transform', utils.translate(-scale.margin, -scale.margin))
  .attr('class', 'disablePad')
  .attr('width', scale.width + scale.margin)
  .attr('height', scale.height + scale.margin + scale.margin);
};

var drawMiscData = function(options) {

  if (options.graphType === GraphTypes.MAIN) {
    drawTimeBar(options);
    drawPredictPoint(options);
  }
};

var drawDangerZone = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var dangerArray = utils.findDangerZones(options.data2, [data[0].time, data[data.length - 1].time]);

  // DATA JOIN
  var zoneRects = graph.selectAll('.dangerBlock')
                  .data(dangerArray, function(datum) { return datum[0].getTime() + datum[1].getTime(); });

  // UPDATE

  // ENTER
  zoneRects.enter().append('rect')
  .attr('class', 'dangerBlock')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .attr('clip-path', 'url(#clip)')
  .attr('y', 0)
  .attr('height', scale.height - scale.headerOffset - scale.footerOffset)
  .attr('width', function(datum) {
    return scale.xRange(datum[1]) - scale.xRange(datum[0]);
  });

  // UPDATE & ENTER
  zoneRects
  .transition().duration(750)
  .attr('x', function(datum) {
    return scale.xRange(datum[0]);
  });

  // EXIT
  zoneRects.exit().remove();
};

var drawFocus = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var halfHeight = (scale.height - scale.headerOffset - scale.footerOffset) / 2;
  // var graphHeight = scale.height - scale.headerOffset - scale.footerOffset;
  // var graphWidth = scale.width - scale.axisOffset - scale.axisOffset;
  // var buttonRadius = graphWidth / graphHeight * 2; 

  // Draw the focus/////////////////////////////////////////////////////////
  var focus = graph.append('svg:g')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
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
  .attr('y2', scale.height - scale.headerOffset - scale.footerOffset);

  focus.append('svg:line')
  .attr('class', 'focusYLine')
  .attr('x1', 0)
  .attr('x2', scale.width - scale.axisOffset - scale.axisOffset);  

  // Data info and highlight
  focus.append('svg:text')
  .attr('class', 'focusData highlight')
  .attr('dy', '-3rem');
  focus.append('svg:text')
  .attr('class', 'focusData info')
  .attr('dy', '-3rem');
  
  // Date info and highlight
  focus.append('svg:text')
  .attr('class', 'focusDate highlight')
  .attr('dy', '-1rem');
  focus.append('svg:text')
  .attr('class', 'focusDate info')
  .attr('dy', '-1rem');

  focus.append('svg:text')
  .attr('class', 'scrollText')
  .attr('text-anchor', 'middle')
  .attr('x', (scale.width - scale.axisOffset - scale.axisOffset) / 2)
  .attr('y', scale.height - scale.headerOffset - scale.footerOffset)
  .attr('dy', '-1rem')
  .text('Click to scroll');

  /* Might want to refactor these 'buttons' into a svg def for code reduce and reuse */
   // Left Button//////////////////////////
  var leftButton = focus.append('svg:g')
  .attr('class', 'graphButton left')
  .attr('opacity', scale.range[0] > data[0].time ? 0.35 : 0);

  leftButton.append('svg:circle')
  .attr('class', 'graphCircle')
  .attr('cx', scale.axisOffset)
  .attr('cy', halfHeight);

  leftButton.append('svg:path')
  .attr('class', 'graphArrow')
  .attr('transform', utils.translate(scale.axisOffset, halfHeight) + 
    ' rotate(180) ' + 
    utils.translate(-8, -8))
  .attr('d', 'M0,0 L0,16 L20,8 z');

  // Right Button///////////////////////////////
  var rightButton = focus.append('svg:g')
  .attr('class', 'graphButton right')
  .attr('opacity', scale.range[1] < data[data.length - 1].time ? 0.35 : 0);

  rightButton.append('svg:circle')
  .attr('class', 'graphCircle')
  .attr('cx', scale.width - 3 * scale.axisOffset)
  .attr('cy', halfHeight);

  rightButton.append('svg:path')
  .attr('class', 'graphArrow')
  .attr('transform', utils.translate(scale.width - 3 * scale.axisOffset - 8, halfHeight - 8))
  .attr('d', 'M0,0 L0,16 L20,8 z');

  return focus;
};

var updateFocus = function(options, update, focus) {

  /*
  update = {
    x: absolute x position on graph
    y: absolute y position on graph
    dy: y axis offset
    nearestDatum: Date
    textAnchor: String for text-anchor css
  }
  */

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Update the position of all the focus elements /////////////////////////////////////////////////////////
  focus.select('.focal')  
  .attr('transform', utils.translate(update.x, update.y));  

  focus.select('.focusXLine')
  .attr('transform', utils.translate(update.x, update.y))
  .attr('y2', scale.height - scale.headerOffset - scale.footerOffset - update.y);

  focus.select('.focusYLine')  
  .attr('transform', utils.translate(0, update.y));  

  // We had to manually move both highlight and info in order to force this order of rendering
  focus.select('.focusData.highlight')
  .attr('transform', utils.translate(update.x, update.y))
  .attr('text-anchor', update.textAnchor)
  .attr('dy', update.dy[0])
  .text( (Math.round((update.nearestDatum.point + 0.00001) * 100) / 100) + ' ' + options.unit);

  focus.select('.focusData.info')
  .attr('transform', utils.translate(update.x, update.y))
  .attr('text-anchor', update.textAnchor)
  .attr('dy', update.dy[0])
  .text( (Math.round((update.nearestDatum.point + 0.00001) * 100) / 100) + ' ' + options.unit);

  focus.select('.focusDate.highlight')
  .attr('transform', utils.translate(update.x, update.y))
  .attr('text-anchor', update.textAnchor)
  .attr('dy', update.dy[1])
  .text( utils.formatFocusDate(update.nearestDatum.time) );

  focus.select('.focusDate.info')
  .attr('transform', utils.translate(update.x, update.y))
  .attr('text-anchor', update.textAnchor)
  .attr('dy', update.dy[1])
  .text( utils.formatFocusDate(update.nearestDatum.time) );
};

var drawCapturePad = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // // Draw the focus//////////////////////////////////////////
  var focus = drawFocus(options);

  // Draw the Surface////////////////////////////////////////////
  var surface = graph.append('svg:rect')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .attr('width', scale.width - scale.axisOffset - scale.axisOffset)
  .attr('height', scale.height - scale.headerOffset - scale.footerOffset)
  .style('fill', 'none')
  // Event Listeners
  .style('pointer-events', 'all')
  .on('mouseover', function() { 
    focus.style('display', null); })
  .on('mouseout', function() { 
    focus.style('display', 'none'); })
  .on('mousemove', function() {
    surfaceMove(options, d3.mouse(this), focus);
  })
  .on('click', function() {
    surfaceClick(options, d3.mouse(this), focus);
  });
};

// EVENT FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
var surfaceMove = function(options, mouse, focus) {

  var scale = options.scale;
  var data = options.data;
  var update = {};

  // Get date associated with the mouse position
  var mouseDate = scale.xRange.invert(mouse[0]);

  // Calculate get the index right before the mouse date and then find whether left or right is closer
  var index = utils.bisectDateIndex(data, mouseDate);
  var nearestDatum = update.nearestDatum = (mouseDate - data[index].time > data[index + 1].time - mouseDate) ? data[index + 1] : data[index];

  var x = update.x = scale.xRange(nearestDatum.time);
  var y = update.y = scale.yRange(nearestDatum.point);

  // Calculate dx and dy based on how far along the graph we are. This is for moving the tooltip around 
  update.textAnchor = (x / (scale.width - scale.axisOffset - scale.axisOffset)) < 0.88 ? 'start' : 'end';
  update.dy = (y / (scale.height - scale.headerOffset - scale.footerOffset)) < 0.1 ? ['4rem', '2rem'] : ['-3rem', '-1rem'];

  /*
  update = {
    x: absolute x position on graph
    y: absolute y position on graph
    dy: y axis offset
    nearestDatum: Date
    textAnchor: String for text-anchor css
  }
  */

  updateFocus(options, update, focus);
};

var surfaceClick = function(options, mouse, focus) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Calculate the new Domain
  var left;
  var right;
  var oneDay = 24 * 60 * 60 * 1000;

  if (mouse[0] < (scale.width - scale.axisOffset - scale.axisOffset) / 2) {
    left = new Date(scale.range[0].getTime() - oneDay);
    right = new Date(scale.range[1].getTime() - oneDay);

    // If we keep going left but hit end before oneDay
    var rightOffset = scale.range[0] - data[0].time;
    var residualRight = new Date(scale.range[1].getTime() - rightOffset);

    scale.range = left >= data[0].time ? [left, right] : [data[0].time, residualRight];
  }
  else {
    left = new Date(scale.range[0].getTime() + oneDay);
    right = new Date(scale.range[1].getTime() + oneDay);

    // If we keep going right but hit end before oneDay
    var leftOffset = data[data.length - 1].time - scale.range[1];
    var residualLeft = new Date(scale.range[0].getTime() + leftOffset);

    scale.range = right < data[data.length - 1].time ? [left, right] : [residualLeft, data[data.length - 1].time];
  }

  // Update the Axis
  drawAxis(options);

  // Update the Line Path
  drawLine(options);

  // Update Various graph components
  drawPredictPoint(options);
  drawTimeBar(options);
  if (options.graphType === GraphTypes.USER_KWH) {
    drawDangerZone(options);
  }

  // Update the Buttons
  focus.select('.graphButton.left')
  .transition().duration(750)
  .attr('opacity', scale.range[0] > data[0].time ? 0.35 : 0);
  focus.select('.graphButton.right')
  .transition().duration(750)
  .attr('opacity', scale.range[1] < data[data.length - 1].time ? 0.35 : 0);
};
