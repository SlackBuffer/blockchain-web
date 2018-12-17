const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600)

const margin = { top: 20, right: 20, bottom: 100, left: 100 }
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g')

// scales
// y scale
const y = d3.scaleLinear()
  .range([graphHeight, 0]) // 改纵坐标方向
// console.log(y(400))

// const min = d3.min(data, ({ orders }) => orders)
// const max = d3.max(data, ({ orders }) => orders)
// const extent = d3.extent(data, ({ orders }) => orders)
// console.log(extent)

// x scale
const x = d3.scaleBand()
  .range([0, 500])
  .paddingInner(0.2)
  .paddingOuter(0.2)
// console.log(x.bandwidth())


// create the axes
const xAxis = d3.axisBottom(x) // ticks coming out at the bottom
const yAxis = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(y => y + ' orders')

xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)' )
  .attr('text-anchor', 'end' )  // default anchor is middle, the middle of the text
  .attr('color', 'orange')

const t = d3.transition().duration(2500)

const update = data => {
  // 1. update scales (domains) if they rely on `data`
  y.domain([0, d3.max(data, ({ orders }) => orders)])
  x.domain(data.map(({ name }) => name))

  // 2. join updated data to elements
  const rects = graph.selectAll('rect')
    .data(data)

  // 3. remove unwanted (if any) shapes using the exit selection
  rects.exit().remove()

  // 4. update current shapes in the dom

  rects.attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', ({ name }) => x(name))
  // .transition().duration(500)
  //   .attr('height', ({ orders }) => graphHeight - y(orders))
  //   .attr('y', ({ orders }) => y(orders))

  // 5. append the enter selection to the dom
  rects.enter()
    .append('rect')
      // .attr('width', x.bandwidth)
      // .attr('width', 0)
      // .attr('height', ({ orders }) => graphHeight - y(orders)) // 由于纵坐标的反向而改算法
      // .attr('y', ({ orders }) => y(orders)) // 改 y 的起始点
      .attr('height', 0) // starting condition
      .attr('y', graphHeight) // starting condition
      .attr('fill', 'orange')
      .attr('x', ({ name }) => x(name))
      .merge(rects) // apply the following both to the current rects as well as the enter selection
        .transition(t)
          .attrTween('width', widthTween)
          .attr('height', ({ orders }) => graphHeight - y(orders)) // ending condition. 由于纵坐标的反向而改算法
          .attr('y', ({ orders }) => y(orders)) // ending condition. 改 y 的起始点

  // call axis
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)
}

let data = []
db.collection('dishes').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id}
    switch (change.type) {
      case 'added':
        data.push(doc)
        break
      case 'modified':
        data = data.map(item => item.id === doc.id ? doc : item)
        break
      case 'removed': 
        data = data.filter(({ id }) => id !== doc.id)
      default:
        break
    }
  })
  update(data)
})
// starting conditions
// Y = graphHeight
// Height = 0
// Ending conditions
// Y = y(d.orders)
// Height = graphHeight - y(d.orders)

// TWEENS
const widthTween = d => {
  // define interpolation
  // d3.interpolation returns a function
  let i = d3.interpolate(0, x.bandwidth()) // (starting position, ending position)
  // pass `i` a value between 0 and 1

  // return a function which takes in a time ticker `t`
  // `t` ([0, 1]) represents (mapping) the duration of the transition 
  return function(t) {
    return i(t) // i(0) => 0, i(1) => x.bandwidth
  }
}



// d3.json('menu.json').then(data => {
/* db.collection('dishes').get().then(res => {
  const data = []
  res.docs.forEach(doc => {
    data.push(doc.data())
  })

  d3.interval(() => {
    data.pop()
    update(data)
  }, 3000)
}) */


// const svg = d3.select('svg')

// d3.json('planets.json').then(data => {
//   const circs = svg.selectAll('circle')
//     .data(data)
//   // add attrs to circs already in DOM
//   circs.attr('cy', 200)
//     .attr('cx', ({ distance }) => distance)
//     .attr('r', ({ radius }) => radius)
//     .attr('fill', ({ fill }) => fill)
  
//   // append the enter selection to the DOM
//   circs.enter()
//     .append('circle')
//     .attr('cy', 200)
//     .attr('cx', ({ distance }) => distance)
//     .attr('r', ({ radius }) => radius)
//     .attr('fill', ({ fill }) => fill)
// })


// const data = [
//   { width: 200, height: 100, fill: 'purple'},
//   { width: 100, height: 60, fill: 'pink'},
//   { width: 50, height: 30, fill: 'red'},
// ]

// const svg = d3.select('svg')

// const rects = svg.selectAll('rect')
//   .data(data)
//   // i is the index, n is the current selection (rect, an array); "this" will be bound to Window, use n[i] to fix "this" issue
//   .attr('width', ({ width }, i, n) => width)
//   // "this" will bound to the element applied data property
//   .attr('height', function ({ height }) { return height })
//   .attr('fill', ({ fill }) => fill)

// rects.enter()
//   .append('rect')
//   .attr('width', ({ width }, i, n) => width)
//   .attr('height', function ({ height }) { return height })
//   .attr('fill', ({ fill }) => fill)

// const a = document.querySelector('div')
// const b = d3.select('div') // comes with d3 methods
// console.log(a, b)


// const canvas = d3.select('.canvasD')
// const svg = canvas.append('svg')
//   .attr('height', 600)
//   .attr('width', 600)

// const group = svg.append('g')
//   .attr('transform', 'translate(0, 100)')
// // append shapes to svg container
// group.append('rect')
//   .attr('x', 20)
//   .attr('y', 20)
//   .attr('width', 200)
//   .attr('height', 100)
//   .attr('fill', 'blue')

// group.append('circle')
//   .attr('cx', 300)
//   .attr('cy', 70)
//   .attr('r', 50)
//   .attr('fill', 'pink')

// group.append('line')
//   .attr('x1', 370)
//   .attr('y1', 20)
//   .attr('x2', 400)
//   .attr('y2', 120)
//   .attr('stroke', 'red')

// svg.append('text')
//   .attr('x', 20)
//   .attr('y', 200)
//   .attr('fill', 'grey')
//   .text('hello d3')
//   .style('font-family', 'arial')