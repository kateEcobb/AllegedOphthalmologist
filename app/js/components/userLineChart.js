var d3 = require('d3');

// MAIN ///////////////////////////////////////////////////
var createChart = function(el, props, state) {
  var options = initGraph(el, props, state);
  drawAxes(options);
  drawLine(options);
  //drawPoints(options);
  return options.graph;
};
///////////////////////////////////////////////////////////

// Sets up the graph options object that will be passed along
// returns Object{ graph, scale, data}
var initGraph = function(el, props, state) {
  var options = {};

  // Need to find the range based off of the Watt data
  var wattMin = d3.min(state.data.Watt, function(datum) {
    return new Date(datum.timestamp);
  });
  var wattMax = d3.max(state.data.Watt, function(datum) {
    return new Date(datum.timestamp);
  });

  // DATA /////////////////////
  var data = options.data = [];
  var temp = [];

  // Parse state to obtain required data
  for (var i = 0; i < state.data.Utility.length; i++) {
    data.push({
      power: parseFloat(state.data.Utility[i].interval_kWh),
      time: new Date(state.data.Utility[i].interval_start),
      id: state.data.Utility[i]._id
    });
  }

  // Sort data by timestamp
  data.sort(function(a, b) {
    return a.time - b.time;
  });

  // Filter out only the data that fits into watt data
  data = options.data = data.filter(function(datum) {
    // console.log('Compare', [datum.time, wattMin, wattMax]);
    if (datum.time >= wattMin && datum.time <= wattMax) {
      // console.log('true');
      return true;
    }
    else {
      return false;
    }
  });

  console.log('Utility is', data);

  // SCALE //////////
  var scale = options.scale = {
    height: parseInt(props.height, 10),
    width: parseInt(props.width, 10),
    margin: parseInt(props.margin, 10),
    axisOffset: 50,
    yMinRatio: 0.98,
    yMaxRatio: 1.02,
  };

  scale.yRange = d3.scale.linear().domain([d3.min(data, function(datum) {
    return datum.power * scale.yMinRatio;
  }), d3.max(data, function(datum) {
    return datum.power * scale.yMaxRatio;
  })])
  .range([scale.height - scale.axisOffset - scale.axisOffset, 0]);

  scale.xRange = d3.time.scale.utc().domain([wattMin, wattMax])
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
                    return scale.yRange( datum.power );
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