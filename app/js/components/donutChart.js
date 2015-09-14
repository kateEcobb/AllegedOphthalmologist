var d3Chart = {};


d3Chart.create = function(el, data, className){

  //el is modal-body
  var modal = d3.select(el);
  var modalSpec;

  if(modal.node() !== null){
    modalSpec = modal.node().getBoundingClientRect();
  }

  specs = {
    w: modalSpec.width/2 - 15,
    h: modalSpec.width/2 - 15,
    r: modalSpec.width/4 - 20,
    innerR: (modalSpec.width/4 - 20)*0.75,
    color: d3.scale.ordinal().range(['#528C18', '#648C85', '#B3F2C9', '#A60F2B']),
    names: d3.scale.ordinal().range(['source1','source2','source3','source4']),
    subTitle: d3.scale.ordinal().range(['breakdownSub', 'totalSub']),
    data: processData(data),
  };
  

  var vis = modal
    .append('div')
    .attr('class', className+'div')
    .style({
      'display': 'inline-block',
      'position': 'relative',
      'width': specs.w + 'px',
    })
    .append("svg:svg")
    .data([specs.data])
    .attr("width", specs.w)
    .attr("height", specs.h)
    .attr("class", className)
    .attr('display', 'inline-block')
    .append('svg:g')
    .attr("transform", "translate("+specs.r+","+specs.r+")");


  var arc = d3.svg.arc()
    .innerRadius(specs.innerR)
    .outerRadius(specs.r);

  var pie = d3.layout.pie()
    .value(function(d){return d.percentage; });


  var arcs = vis.selectAll('g.slice')
    .data(pie)
    .enter()
      .append('svg:g')
        .attr('className', 'slice');

  arcs.append('svg:path')
    .attr('fill', function(d, i){return specs.color(i); })
    .attr('class', function(d, i){return specs.names(i); })
    .attr('d', arc)
    .style('stroke', 'white')
    .style('stroke-width', '5');

  arcs.on('mouseover', function(d){
    toolTip(className+'div', d, specs);

  }).on('mouseout', function(d){
    d3.select('.toooltip')
      .remove();
  });

  legend(className, specs.color, specs.data, specs.names);
};

d3Chart.removeGraph = function(className){
  d3.select('.'+className+'div').remove();
};

var legend = function(className, color, data, names){

  var elSpecs = d3.select("."+className).node().getBoundingClientRect();

  var RectSize = elSpecs.width/15.2;
  var Spacing = elSpecs.width/72.75;


  var legend = d3.select("."+className).selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', function(d, i){return specs.names(i); })
    .attr('transform', function(d, i){
      var height = RectSize + Spacing;
      var offset = color.domain().length / 2;
      var horz = (elSpecs.width / 2) - 55;
      var vert = (elSpecs.height / 2) + (i - offset) * height;
      return "translate(" + horz + "," + vert + ")";
    });

  legend.append('rect')
    .attr('width', RectSize)
    .attr('height', RectSize);

  legend.append('text')
    .attr('x', RectSize + Spacing)
    .attr('y', RectSize - Spacing)
    .attr('font-size', 'smaller')
    .text(function(d){return data[d].type; });

};

var toolTip = function(className, data, specs){

  var svg = d3.select('.'+className).select('svg').node().getBoundingClientRect();
  var svgParent = d3.select('.'+className).node().getBoundingClientRect();

  position = {
    top: (specs.h/6) - (svg.height - svgParent.height),
    left: svgParent.width/2 - 62,
  };

  var textBox = d3.select('.'+className)
    .append('div')
    .attr('class', 'toooltip')
    .style({
      'display': 'inline',
      'position': 'absolute',
      'top': position.top + 'px',
      'left': position.left +'px',
      'height': 'auto',
      'width': '100px',
      'background-color': '#636363',
      'z-index': '10',
      'color': 'white',
      'text-align': 'center',
      'font-size': '9pt',
      'padding': '4px',
      'border-radius': '4px'
    });


  textBox
    .text(data.data.type  + ': \n'  + data.data.percentage +'%');

};

d3Chart.subtitle = function(className, idName, title){
  d3.select('.' + className + 'div')
    .append('span')
    .attr('id', idName)
    .text(title);
};

var processData = function(data){
  var totalMW = 0, breakDown = [];
  data.forEach(function(element){
    totalMW += element.gen_MW;
  });

  data.forEach(function(element){
    var type = element.fuel;
    type = type.substr(0,1).toUpperCase() + type.substr(1).toLowerCase();
    if(type === "Renewable"){ 
      type = "Other Renewables";
    } else if (type === "Other"){ 
      type = "Non-Renewables"
    }
    var percentage = Math.round((element.gen_MW / totalMW)*100, 2);
    breakDown.push({type: type, percentage: percentage});
  });

  if(breakDown[0].type === 'Non-Renewables'){
    var temp = breakDown.shift();
    breakDown.push(temp);
  }

  return breakDown;
};

module.exports = d3Chart;
