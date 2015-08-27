var d3Chart = {};


d3Chart.create = function(el){
  console.log('you made it');

  var modal = d3.select(el)
  
  specs = {
    w: 300,
    h: 300,
    r: 100,
    color: d3.scale.category20c(),
    data: [
      {"label" : 'one', "value" : 20},
      {"label" : 'two', "value" : 50},
      {"label" : 'three', "value" : 30}
    ]
  };

  var vis = modal.append("svg:svg")
    .data([specs.data])
    .attr("width", specs.w)
    .attr("height", specs.h)
    .append('svg:g')
    .attr("transform", "translate("+specs.r+","+specs.r+")")


  var arc = d3.svg.arc()
    .outerRadius(specs.r);

  var pie = d3.layout.pie()
    .value(function(d){return d.value});


  var arcs = vis.selectAll('g.slice')
    .data(pie)
    .enter()
      .append('svg:g')
        .attr('class', 'slice');

  arcs.append('svg:path')
    .attr('fill', function(d, i){return specs.color(i)})
    .attr('d', arc);

  arcs.append('svg:text')
    .attr("transform", function(d){
      d.innerRadius = 0;
      d.outerRadius = specs.r;
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr('text-anchor', 'middle')
    .text(function(d, i){ return specs.data[i].label; });

}


// d3Chart.create = function(el, props, state){
//   // console.log(props);
//   var svg = d3.select('.modal-content').append('svg')
//     .attr('class', 'd3')
//     .attr('width', props.width)
//     .attr('height', props.height)

//   svg.append('g')
//     .attr('class', 'd3-points');

//   this.update(el, state);
// }

d3Chart._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;

  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  var z = d3.scale.linear()
    .range([5, 20])
    .domain([1, 10]);

  return {x: x, y: y, z: z};
};


d3Chart.update = function(el, state){
  var scales = this._scales(el, state.domain);
  this._drawPoints(el, scales, state.domain);
}

d3Chart._drawPoints = function(el, scales, data){
  var g = d3.select(el).selectAll('.d3-points');

  var points = g.selectAll('.d3-point')
    .data(data, function(d){return d.id; });

  point.enter().append('circle')
    .attr('class', 'd3-point');

  point.attr('cx', function(d) { return scales.x(d.x); })
      .attr('cy', function(d) { return scales.y(d.y); })
      .attr('r', function(d) { return scales.z(d.z); });

  point.exit()
      .remove();
}

module.exports = d3Chart;