// establish width, height and margins

let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// append the SVG group that will hold the chart
//shift the group over using the atranform attribute to specify left and top margins
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// establish initial parameters for x and y axis data
let chosenXAxis = 'poverty';
let chosenYAxis = 'healthcare';

// add function for choosing scales
// @TODO ------ wrap the



// import data
d3.csv("data.csv").then(function(dataSet){
  // cast as numbers and strings
    dataSet.forEach(function(data){
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.abbr = String(data.abbr);
      data.State = String(data.State);
    });

    //set axes
    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(dataSet, d => d.poverty) *0.95, 
        d3.max(dataSet, d => d.poverty)*1.05])
      .range([0, width]);

    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(dataSet, d=> d.healthcare) *.80, 
        d3.max(dataSet, d => d.healthcare)* 1.05])
      .range([height, 0]);
    
    // Create axis objects
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //append axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    
    chartGroup.append("g")
      .attr("transform", `translate(0,0)`)
      .call(leftAxis);

    // label the axes
    //x axis labels
    // poverty label
    chartGroup.append('text')
      .attr('x', 400)
      .attr('y', 440)
      .text('in Poverty (%)');
    
  
    //@TODO ----add Median Age and Median Household Income labels

    // y axis
    // healthcare label
    chartGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr('x', 0 - (height / 2))
    .attr('y', 0 - margin.right)
    // .attr('x', 250)
    // .attr('y', 480)
    // .style('text-anchor', 'middle')
    // .attr('dy', '1em')
    .classed('axis-text', true)
    .text('Lacks Healthcare (%)');

    console.log(height/2)

    console.log(margin.right)

    //@TODO ----add Obesity and Smoker Labels
    
    // create the chart data
    let theCircles = svg.selectAll("g theCircles").data(dataSet).enter();


    let circlesGroup = theCircles
      // .selectAll("circle")
      // .data(dataSet)
      // .enter()
      .append("circle")
      .attr('cx', d => xLinearScale(d.poverty) + margin.left)
      .attr('cy', d => yLinearScale(d.healthcare))
      .attr('r', '15')
      .attr('fill', 'tomato')
      // .attr('class', d => "stateCircle " + d.abbr)
      .attr('stroke-width', '0.7')
      .attr('stroke', 'gray')
      .style('opacity', 0.7);
    
    let textLabels = theCircles
      // .selectAll("text")
      // .data(dataSet)
      // .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d.poverty) + margin.left)
      .attr("dy", d => yLinearScale(d.healthcare))
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("fill", "black")
      .style('text-anchor', 'middle');

      console.log(dataSet)
    
    
    // create a tooltip and store it as a variable

    let toolTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([0, 0])
      .html(function(d) {
        return(`${d.state} <br> Poverty Rate: ${d.poverty}% <br> w/o healthcare: ${d.healthcare}%`)
      });
    
    //call the toolTip from chartGroup to create the tool tip in the chart
    chartGroup.call(toolTip);

    // create an event listener to show the tool tip
    circlesGroup.on('mouseover', function(d){
      toolTip.show(d,this);
    });
});





// how does the file pathing work? I'd like to reference the data.csv file in the data folder...
//... not in the main directory next to the index.html file

// how to properly label the circles with state abbreviation data?

//how does tool tip box formatting work?

//additional work to make this interactive
// link selectors to different data elements
// add chosenXAxis and chosenYAxis variables
// add event triggers to select new axis data and re-render the chart