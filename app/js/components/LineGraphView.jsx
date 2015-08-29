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
    console.log(this.state.data.Watt[0]);
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

    // Parse out the required data from the state
    var data = [];
    var dataTime = [];
    for (var i = 0; i < state.data.Watt.length; i++) {
      data.push({
        carbon: parseInt(state.data.Watt[i].carbon),
        time: new Date(state.data.Watt[i].timestamp),
        id: state.data.Watt[i]._id
      });
    }

    for (var i = 0; i < state.data.Watt.length; i++) {
      dataTime.push({
        carbon: parseInt(state.data.Watt[i].carbon),
        time: state.data.Watt[i].timestamp
      });
    }

    // Sort the data by time
    data.sort(function(a, b) {
      return a.time - b.time;
    });

    dataTime.sort(function(a, b) {
      return new Date(a.time) - new Date(b.time);
    })

    // Set up the graph dimensions
    var scale = {
      height: parseInt(props.height, 10),
      width: parseInt(props.width, 10),
      margin: parseInt(props.margin, 10)
    };

    // Set up the graph
    var graph = d3.select(el).append('svg:svg')
              .attr('class', 'svg')
              .attr('width', scale.width + scale.margin + scale.margin)
              .attr('height', scale.height + scale.margin + scale.margin)
              .append('svg:g')
                .attr('transform', 'translate(' + (scale.margin) + ',' + (scale.margin) + ')');

    this.createScale(graph, scale, data, dataTime);
  },

  createScale: function(graph, scale, data, dataTime) {

    // Additional parameters we need to calculate to create the x and y axis and pass to draw the line
    scale.axisOffset = 50;   // Inner offset used as margins on either side in order to give the axis space to show
    scale.yMaxRatio = 1.05;  // Ratio we use to give some extra padding to the top of the graph

    // Ranges we need to scale the datapoints
    scale.yRange = d3.scale.linear().domain([d3.min(data, function(datum) {
      return datum.carbon;
    }), d3.max(data, function(datum) {
      return datum.carbon * scale.yMaxRatio;  
    })])
    .range([scale.height - scale.axisOffset - scale.axisOffset, 0]);

    scale.xRange = d3.scale.linear().domain([d3.min(data, function(datum) {
      return datum.time;
    }), d3.max(data, function(datum) {
      return datum.time;
    })])
    .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

    scale.xTimeRange = d3.time.scale.utc().domain([data[0].time, data[data.length - 1].time])
    .range([0, scale.width - scale.axisOffset - scale.axisOffset]);

    var xAxis = d3.svg.axis().scale(scale.xRange);

    var xTimeAxis = d3.svg.axis().scale(scale.xTimeRange);

    var yAxis = d3.svg.axis().scale(scale.yRange).orient('left');

    graph.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.height - scale.axisOffset) + ')')
    .call(xTimeAxis);

    graph.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (scale.axisOffset) + ')')
    .call(yAxis);

    this.drawPoints(graph, scale, data);
    this.drawGraph(graph, scale, data, dataTime);
  },

  drawGraph: function(graph, scale, data, dataTime) {

    var lineFunc = d3.svg.line()
                    .x(function(datum, i) {
                      return scale.xTimeRange( datum.time );
                    })
                    .y(function(datum) {
                      return scale.yRange( datum.carbon );
                    })
                    .interpolate('linear');

    graph.append('svg:path')
    .attr('d', lineFunc(data))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('transform', 'translate(' + (scale.axisOffset) + ', 0)' );
  },

  drawPoints: function(graph, scale, data) {
    var pointGraph = graph.append('svg:g')
                      .attr('class', 'pointGraph')
                      .attr('transform', 'translate(' + (scale.axisOffset) + ',' + (0) + ')');
    console.log('Data', data);
    // DATA JOIN
    var points = pointGraph.selectAll('circle')
                  .data(data, function(datum) {return datum.id;});

    // DATA UPDATE

    // ENTER
    points.enter().append('circle')
    .attr('class', 'linePoint')
    .attr('cx', function(datum) {
      return scale.xTimeRange( datum.time ); 
    })
    .attr('cy', function(datum) {
      return scale.yRange( datum.carbon ); 
    });

    // EXIT
    points.exit().remove();
  }

});

module.exports = LineGraphView;