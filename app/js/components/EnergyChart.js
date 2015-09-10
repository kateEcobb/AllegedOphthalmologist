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
  // var parsedState = utils.parseState(state);
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

  // DATA ===============================
  switch(options.graphType) {

    // Main Graph Types
    case GraphTypes.MAIN:
      data = options.data = utils.parseWattData(state);
      options.unit = "lbs/Mwh";
      options.tasks = [drawLine, drawAxis, drawMiscData, drawAxisScale, drawCapturePad];
      break;

    case GraphTypes.USER_CARBON:
      data = options.data = utils.parseUserCarbonData(state);
      options.unit = 'lbs';
      options.tasks = [drawLine, drawAxis, drawAxisScale, drawCapturePad];
      break;

    case GraphTypes.USER_KWH:
      data = options.data = utils.parseUserKwhData(state);
      options.unit = 'Kwh';
      options.tasks = [drawLine, drawAxis, drawAxisScale, drawCapturePad];
      break;

    // Supplemental Graph Types
    case GraphTypes.USER_REQUIRE:
      data = options.data = utils.parseWattData(state);
      options.tasks = [drawAxis, drawAxisScale, drawDisablePad];
      break;

    case GraphTypes.DANGER_ZONE:
      data = options.data = utils.parseUserKwhData(state);
      options.data2 = utils.parseWattData(state, false);
      options.tasks = [drawDangerZone];
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
    headerOffset: 10,
    footerOffset: 25,
    axisOffset: 40, 
    yMinRatio: 0.95,
    yMaxRatio: 1.02,
    orient: options.overlay ? 'right' : 'left',
  };

  // Set up the yRange
  scale.yRange = d3.scale.linear().domain([d3.min(data, function(datum) {
    // return datum.point * scale.yMinRatio * (scale.ratio ? datum.ratio : 1);
    return datum.point * scale.yMinRatio;
  }), d3.max(data, function(datum) {
    // return datum.point * scale.yMaxRatio * (scale.ratio ? datum.ratio : 1);
    return datum.point * scale.yMaxRatio;
  })]).nice()
  .range([scale.height - scale.headerOffset - scale.footerOffset, 0]);

  // Set up the xRange - Time Scale
  scale.xRange = d3.time.scale().domain([ 
    // (options.overlay ? parsedState[options.overlay][0].time : data[0].time), 
    // (options.overlay ? parsedState[options.overlay][parsedState[options.overlay].length - 1].time : data[data.length - 1].time)
    data[0].time,
    data[data.length - 1].time
  ])
  .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

  // GRAPH ==============================
  var graph = options.graph = d3.select(el).append('svg:svg')
                              .attr('class', 'energyGraph')
                              .attr('width', scale.width + scale.margin + scale.margin)
                              .attr('height', scale.height + scale.margin + scale.margin)
                            .append('svg:g')
                              .attr('transform', utils.translate(scale.margin, scale.margin));

  return options;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
// Drawing Functions ///////////////////////////////////////////////////////////////////////////

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
    .attr('transform', utils.translate(scale.axisOffset, scale.height - scale.footerOffset))
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
                    // return scale.yRange( datum.point * (scale.ratio ? datum.ratio : 1) );
                    return scale.yRange( datum.point );
                  })
                  .interpolate('linear');

  // Draw the Path
  graph.append('svg:path')
  .attr('d', lineFunc(data))
  .attr('class', 'energyPath')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset) );

  return;
};

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
  // .attr('transform', 'rotate(-90) ' + utils.translate(-10, scale.height / 2))
  .attr('text-rendering', 'optimizeLegibility')
  .attr('transform', utils.translate(-1, scale.height / 2) + ' rotate(-90)')
  .text(options.unit);
};

var drawTimeBar = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var timeNow = new Date(Date.now());
  var currentX = scale.xRange(timeNow);

  graph.append('svg:g')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
    .append('svg:rect')
    .attr('class', 'currentTimeBar')
    .attr('height', scale.height - scale.headerOffset - scale.footerOffset)
    .attr('width', scale.barWidth)
    .attr('x', currentX - scale.barWidth / 2)
    .attr('y', 0);
};

var drawPredictPoint = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  var predictIndex = utils.findDAHRIndex(data);
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

  var zone = graph.append('svg:g')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .attr('class', 'dangerZone');

  var dangerArray = utils.findDangerZones(options.data2, [data[0].time, data[data.length - 1].time]);
  // console.log(options.data2);
  // console.log(dangerArray);
  // dangerArray.forEach(function(datum) {
  //   var x1 = scale.xRange(datum[0]);
  //   var x2 = scale.xRange(datum[1]);
  //   var width = x2 - x1;
  //   zone.append('svg:rect')
  //   .attr('class', 'dangerBlock')
  //   .attr('x', x1)
  //   .attr('y', 0)
  //   .attr('width', width)
  //   .attr('height', scale.height - scale.headerOffset - scale.footerOffset);
  // });

  // DATA JOIN
  var zoneRects = zone.selectAll('rect')
                  .data(dangerArray, function(datum) { return datum[0].getTime() + datum[1].getTime(); });
  // UPDATE

  // ENTER
  zoneRects.enter().append('rect')
  .attr('class', 'dangerBlock')
  .attr('x', function(datum) {
    return scale.xRange(datum[0]);
  })
  .attr('y', 0)
  .attr('width', function(datum) {
    return scale.xRange(datum[1]) - scale.xRange(datum[0]);
  })
  .attr('height', scale.height - scale.headerOffset - scale.footerOffset);

  // UPDATE & ENTER

  // EXIT
  zoneRects.exit().remove();
};

var drawCapturePad = function(options) {

  var graph = options.graph;
  var scale = options.scale;
  var data = options.data;

  // Draw the focus
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

    // Calculate dx and dy based on how far along the graph we are. This is for moving the tooltip around 
    var textAnchor = (x / (scale.width - scale.axisOffset - scale.axisOffset)) < 0.88 ? 'start' : 'end';
    var dy = (y / (scale.height - scale.headerOffset - scale.footerOffset)) < 0.1 ? ['4rem', '2rem'] : ['-3rem', '-1rem'];

    // Update the position of all the focus elements
    focus.select('.focal')  
    .attr('transform', utils.translate(x, y));  

    focus.select('.focusXLine')
    .attr('transform', utils.translate(x, y))
    .attr('y2', scale.height - scale.headerOffset - scale.footerOffset - y);

    focus.select('.focusYLine')  
    .attr('transform', utils.translate(0, y));  

    focus.select('.focusData.highlight')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .attr('dy', dy[0])
    .text( (Math.round((nearestDatum.point + 0.00001) * 100) / 100) + ' ' + options.unit);

    focus.select('.focusData.info')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .attr('dy', dy[0])
    .text( (Math.round((nearestDatum.point + 0.00001) * 100) / 100) + ' ' + options.unit);

    focus.select('.focusDate.highlight')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .attr('dy', dy[1])
    .text( utils.formatFocusDate(nearestDatum.time) );

    focus.select('.focusDate.info')
    .attr('transform', utils.translate(x, y))
    .attr('text-anchor', textAnchor)
    .attr('dy', dy[1])
    .text( utils.formatFocusDate(nearestDatum.time) );

  };

  // Draw the Surface
  graph.append('svg:rect')
  .attr('transform', utils.translate(scale.axisOffset, scale.headerOffset))
  .attr('width', scale.width - scale.axisOffset - scale.axisOffset)
  .attr('height', scale.height - scale.headerOffset - scale.footerOffset)
  .style('fill', 'none')
  .style('pointer-events', 'all')
  .on('mouseover', function() { 
    focus.style('display', null); })
  .on('mouseout', function() { 
    focus.style('display', 'none'); })
  .on('mousemove', mouseMove);
};
