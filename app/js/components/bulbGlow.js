var d3 = require('d3');

var makeCircle = function(el, props, state){ 
  console.log(state)
  var svgContainer = d3.select(el).append('svg:svg')
                    .attr('className', 'bulbGlowContainer')
                    .attr('width', props.width)
                    .attr('height', props.height);

  var circle = svgContainer.append('circle')
                          .attr('className', 'bulbGlow')
                          .attr('cx', 30)
                          .attr('cy', 30)
                          .attr('r', 20)
                          .style('fill', state.toString())
  return;
};

module.exports = { 
  makeCircle: makeCircle
}