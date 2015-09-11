
var makeBarChart = function(data){
  
  //console.log("creating chart with ", data);

  var width = 220,
      barHeight = 40;

  var x = d3.scale.linear()
      .range([0, width]);
  console.log("X ", x);

  var chart = d3.select(".energy-bar-graph")
      .attr("width", width);

  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) {return x(d.value); })
      .attr('class', function(d){return d.color;})
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", 3)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.value + ' kWh'; });
}

module.exports = makeBarChart;
