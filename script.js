const csvUrl = "https://gist.githubusercontent.com/jeremiak/c564a2227fcc82326b37d0166fd777c7/raw/4da27d4cbbf48abe85bf52936eabfe20e04c4fa7/life_expectancy_gdp_pop_year.csv"

d3.csv(csvUrl).then(function(data) {
  const width = 800
  const height = 400
  
  const incomeMin = d3.min(data, function(d) {
    return +d.income_per_person
  })
  
  const incomeMax = d3.max(data, function(d) {
    return +d.income_per_person
  })
  
  const lifeExpectancyExtent = d3.extent(data, function(d) {
    return +d.life_expectancy
  })
  
  const yearExtent = d3.extent(data, function(d) {
    return +d.year
  })
  
  const populationExtent = d3.extent(data, function(d) {
    return +d.population
  })
  
  const xScale = d3.scaleLog().domain([incomeMin, incomeMax]).range([0, width])
  const yScale = d3.scaleLinear().domain(lifeExpectancyExtent).range([height, 0])
  const rScale = d3.scaleSqrt()
    .domain(populationExtent)
    .range([2, 40])
  
  const svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)
  
  const regionColors = {
    "africa": '#D7FFF1',
    "asia": "#AAFCB8",
    "americas": "#8CD790",
    "europe": '#77AF9C'
  }  
  
  let year = yearExtent[0]
  const earliestYearData = data.filter(function(d) {
    if (+d.year === year) {
      return true
    } else {
      return false
    }
  })
  
  svg.selectAll('circle').data(earliestYearData)
      .enter()
     .append('circle')
      .attr('cy', function(d) {
        const lifeExpectancy = +d.life_expectancy
        return yScale(lifeExpectancy)
      })
      .attr('cx', function(d) {
        const income = +d.income_per_person
        return xScale(income)
      })
      .attr('r', function(d) {
        const population = +d.population
        return rScale(population)
      })
      .attr('fill', function(d) {
        const region = d.region        
        const fill = regionColors[region]
        return fill
      })
      .attr('stroke', '#285943')
            
 /* changing the stroke for a particular country
 , function(d) {
        const country = d.country
        if (country === 'China') {
          return 'hotpink'
        } else {
          return 'black'
        }
      })
  */
    svg.append('text')
    .attr('id', 'year')
    .attr('dy', height * .8)
    .attr('dx', 20)
    .attr('font-size', '100px')
    .attr('opacity', .3)
    .text(year)
  
    const xAxis = d3.axisBottom().scale(xScale).ticks(5, d3.format('.2s'))
  const yAxis = d3.axisLeft().scale(yScale)
  
  svg.append('g').attr('class', 'axis x-axis').attr('transform', 'translate(0 ' + height - 20 + ')').call(xAxis)
  svg.append('g').attr('class', 'axis y-axis').attr('transform', 'translate(20 0)').call(yAxis)
  
  setInterval(function() {
    if (year === 2021) {
      return
    } else {
      year = year + 1 
    }
    
    const yearData = data.filter(function(d) {
      if (+d.year === year) {
        return true
      } else {
        return false
      }
    })

    d3.select('#year').text(year)
    
    d3.selectAll('circle')
      .data(yearData)
      .transition(100)
      .attr('cy', function(d) {
        const lifeExpectancy = +d.life_expectancy
        return yScale(lifeExpectancy)
      })
      .attr('cx', function(d) {
        const income = +d.income_per_person
        return xScale(income)
      })
      .attr('r', function(d) {
        const population = +d.population
        return rScale(population)
      })
    
  }, 100)
  
})
