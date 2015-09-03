var d3 = require('d3');

var makeCircle = function(el, props, state){ 
  var svgContainer = d3.select(el).append('svg:svg')
                    .attr('className', 'bulbGlow')
                    .attr('width', props.width)
                    .attr('height', props.height);

  var circle = svgContainer.append('circle')
                          .attr('cx', 30)
                          .attr('cy', 30)
                          .attr('r', 20)
};

var changeColor = function(){ 
  d3

}



module.exports = makeCircle;