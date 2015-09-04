var d3 = require('d3');

var makeCircle = function(el, props, state){ 
  console.log(state)
  var svgContainer = d3.select(el).append('svg:svg')
                    .attr('className', 'bulbGlowContainer')
                    .attr('width', props.width)
                    .attr('height', props.height)
                    .style('left', '20px')
                    .style('top', '3px')
                    .style('-webkit-filter', 'blur(3px)')

  var defs = svgContainer.append('defs')
  var filter = defs.append('filter')
                  .attr('id', 'gaussian')
                  .append('feGaussianBlur')
                  .attr('in', 'SourceAlpha')
                  .attr('stdDeviation',3)
                  .attr('result','blur')

  var circle = svgContainer.append('circle')
                          .attr('className', 'bulbGlow')
                          .attr('cx', 30)
                          .attr('cy', 30)
                          .attr('r', 30)
                          .style('fill', state.toString())
  return;
};

module.exports = { 
  makeCircle: makeCircle
}