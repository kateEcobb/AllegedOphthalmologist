var d3Chart = {};



d3Chart.create = function(el, data, className){
  // console.log('you made it');

  //el is modal-body
  var modal = d3.select(el)

  if(modal.node() !== null){
    var modalSpec = modal.node().getBoundingClientRect();
  }

  specs = {
    w: modalSpec.width/2 - 15,
    h: modalSpec.width/2 - 15,
    r: modalSpec.width/4 - 20,
    innerR: (modalSpec.width/4 - 20)*.75,
    color: d3.scale.ordinal().range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18']),
    data: processData(data),
    legendRectSize: 18,
    legendSpacing: 4,
  };
  

  var vis = modal
    .append('div')
    .attr('class', className+'div')
    .style({
      'display': 'inline',
      'position': 'relative',
    })
    .append("svg:svg")
    .data([specs.data])
    .attr("width", specs.w)
    .attr("height", specs.h)
    .attr("class", className)
    .attr('display', 'inline')
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

  arcs.on('mouseover', function(d){
    toolTip(className+'div', d, specs);

  }).on('mouseout', function(d){
    d3.select('.toooltip')
      .remove()
  })

  legend(className, specs.legendRectSize, specs.legendSpacing, specs.color, specs.data);
}

d3Chart.removeGraph = function(className){
  d3.select('.'+className+'div').remove();
}

var legend = function(className, RectSize, Spacing, color, data){
  // console.log(d3.select(className).node().getBoundingClientRect());

  var elSpecs = d3.select("."+className).node().getBoundingClientRect();

  var legend = d3.select("."+className).selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i){
      var height = RectSize + Spacing;
      var offset = color.domain().length / 2;
      var horz = (elSpecs.width / 2) - 30;
      var vert = (elSpecs.height / 2) + (i - offset) * height;
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

}

var toolTip = function(className, data, specs){

  console.log('toooltip',className, specs);

  position = {
    height: (specs.h/6),
    width: specs.w/3.25,
  };

  var textBox = d3.select('.'+className)
    .append('div')
    .attr('class', 'toooltip')
    .style({
      'display': 'inline',
      'position': 'absolute',
      'top': position.height + 'px',
      'left': position.width +'px',
      'height': 'auto',
      'width': '100px',
      'background-color': 'black',
      'z-index': '10',
      'opacity': '0.95',
      'color': 'white',
      'textAlign': 'center',
      'font-size': '11pt',
    })

  textBox
    .text('energy type: ' + data.data.type  + '\n'  +'percentage: ' + data.data.percentage)
}

var processData = function(data){
  var totalMW = 0, breakDown = [];
  data.forEach(function(element){
    totalMW += element.gen_MW;
  });

  data.forEach(function(element){
    var type = element.fuel;
    type = type.substr(0,1).toUpperCase() + type.substr(1).toLowerCase()
    var percentage = Math.round((element.gen_MW / totalMW)*100, 2);
    breakDown.push({type: type, percentage: percentage});
  })
  return breakDown;
}


var testData = [
  {
    _id: "55df874cda7c5d2c59ec6e09",
    fuel: "other",
    gen_MW: 36103.55,
  },
  
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

module.exports = d3Chart;
