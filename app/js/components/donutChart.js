var d3Chart = {};


d3Chart.create = function(el, data){
  // console.log('you made it');

  var modal = d3.select(el)
  
  // console.log(data.Watt[0].genmix.slice(1.4), '========================d3======================================');

  specs = {
    w: 400,
    h: 400,
    r: 200,
    innerR: 150,
    color: d3.scale.ordinal().range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18']),
    data: processData(data.Watt[0].genmix.slice(1, 4)),
    legendRectSize: 18,
    legendSpacing: 4,
  };

  var vis = modal.append("svg:svg")
    .data([specs.data])
    .attr("width", specs.w)
    .attr("height", specs.h)
    .append('svg:g')
    .attr("transform", "translate("+specs.r+","+specs.r+")")


  var arc = d3.svg.arc()
    .innerRadius(specs.innerR)
    .outerRadius(specs.r);

  var pie = d3.layout.pie()
    .value(function(d){return d.percentage});


  var arcs = vis.selectAll('g.slice')
    .data(pie)
    .enter()
      .append('svg:g')
        .attr('class', 'slice');

  arcs.append('svg:path')
    .attr('fill', function(d, i){return specs.color(i)})
    .attr('d', arc)
    .style('stroke', 'white')
    .style('stroke-width', '5')

  // arcs.append('svg:text')
  //   .attr("transform", function(d){
  //     d.innerRadius = 0;
  //     d.outerRadius = specs.r;
  //     return "translate(" + arc.centroid(d) + ")";
  //   })
  //   .attr('text-anchor', 'middle')
  //   .text(function(d, i){ return specs.data[i].type; });

  arcs.on('mouseover', function(d){
    console.log(d);
  });

  legend('svg', specs.legendRectSize, specs.legendSpacing, specs.color, specs.data);

}

var legend = function(el, RectSize, Spacing, color, data){
  // console.log(d3.select(el).node().getBoundingClientRect());

  var elSpecs = d3.select(el).node().getBoundingClientRect();

  var legend = d3.select(el).selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i){
      var height = RectSize + Spacing;
      var offset = height * color.domain().length / 2;
      var horz = (elSpecs.width / 2);
      var vert = (elSpecs.height/2) - i * height + offset;
      return "translate(" + horz + "," + vert + ")";
    });

  legend.append('rect')
    .attr('width', RectSize)
    .attr('height', RectSize)
    .style('fill', color)
    .style('stroke', color)

  legend.append('text')
    .attr('x', RectSize + Spacing)
    .attr('y', RectSize - Spacing)
    .text(function(d){return data[d].type; })

  // return legend;
}


var processData = function(data){
  var totalMW = 0, breakDown = [];
  data.forEach(function(element){
    totalMW += element.gen_MW;
  });

  data.forEach(function(element){
    var type= element.fuel;
    var percentage = Math.round((element.gen_MW / totalMW)*100, 2);
    breakDown.push({type: type, percentage: percentage});
  })
  // console.log(breakDown);
  return breakDown;
}


var testData = [
  
  {
    _id: "55df874cda7c5d2c59ec6e08",
    fuel: "wind",
    gen_MW: 606,
  },
  {
    _id: "55df874cda7c5d2c59ec6e07",
    fuel: "solar",
    gen_MW: 5891,
  },
  {
    _id: "55df874cda7c5d2c59ec6e06",
    fuel: "renewable",
    gen_MW: 1708,
  }
]
var unclean = {
  _id: "55df874cda7c5d2c59ec6e09",
  fuel: "other",
  gen_MW: 36103.55,
};

module.exports = d3Chart;
