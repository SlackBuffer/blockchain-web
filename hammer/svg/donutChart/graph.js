// dimension
const dims = {
  height: 300,
  width: 300,
  radius: 150
}

const center = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 }

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150) // leave room for legend
  .attr('height', dims.height + 150)

const graph = svg.append('g')
  .attr('transform', `translate(${center.x}, ${center.y})`)

const pie = d3.pie()
  .sort(null) // don't resort the data
  .value(({ cost }) => cost) // the value needs to evaluate, generate angles based on the cost

const color = d3.scaleOrdinal(d3['schemeSet3']) // range

// legend setup
const legendGroup = svg.append('g')
  .attr('transform', `translate(${dims.width + 40}, 10)`)

const legend = d3.legendColor()
  .shape('circle')
  .shapePadding(10)
  .scale(color)

const tip = d3.tip()
  .attr('class', 'tip card')
  .html(({ data: {name, cost }}) => `<div class="name">${name}</div><div class="cost">${cost}</div><div class="delete">Click slice to delete</div>`)

graph.call(tip)

const arcPath = d3.arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2)
// console.log(arcPath(angles[0])) // d attribute of `<path>`

const update = data => {
  // update color scale domain
  color.domain(data.map(({ name }) => name))

  // update and call legend
  legendGroup.call(legend)
  legendGroup.selectAll('text')
    .attr('fill', '#fff')

  // join enhanced pie data to path elements
  const paths = graph.selectAll('path')
    .data(pie(data))
  // console.log(paths.enter())
  // console.log(pie(data))

  paths.exit()
    .transition().duration(750)
      .attrTween('d', arcTweenExit)
    .remove()

  // update the current DOM elements !!!!
  paths.attr('d', arcPath)
    .transition().duration(750)
      .attrTween('d', arcTweenUpdate)
    

  paths.enter()
    .append('path')
      .attr('class', 'arc')
      // .attr('d', arcPath)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('fill', ({ data: { name } }) => color(name))
      .each(function(data) { this._original = data }) // data is the individual piece of data that we're currently working on 
      .transition().duration(750)
        .attrTween('d', arcTweenEnter)

  graph.selectAll('path')
    .on('mouseover', (d, i, n) => {
      tip.show(d, n[i])
      handleMouseOver(d, i, n)
    })
    .on('mouseout', (d, i, n) => {
      tip.hide(d, n[i])
      handleMouseOut(d, i, n)
    })
    .on('click', handleClick)
}

let data = []
db.collection('expenses').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id }
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

const arcTweenEnter = data => {
  var i = d3.interpolate(data.endAngle, data.startAngle)
  return function(t) {
    data.startAngle = i(t)
    return arcPath(data)
  }
}
const arcTweenExit = data => {
  var i = d3.interpolate(data.startAngle, data.endAngle)
  return function(t) {
    data.startAngle = i(t)
    return arcPath(data)
  }
}

function arcTweenUpdate(data) { // data here is the new data
  // console.log(this._original, data)

  // interpolate between the 2 objects

  var i = d3.interpolate(this._original, data)
  // update the current prop with the new updated data (last update's final state)
  this._original = i(1) // same as this._original = data
  return function(t) {
    return arcPath(i(t))
  }
}


const handleMouseOver = (d, i, n) => {
  // console.log(n[i]) // this
  d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('fill', '#fff')
}

const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('fill', color(d.data.name))
}

const handleClick = ({ data: { id }}) => {
  db.collection('expenses').doc(id).delete()
}

// const angles = pie([
//   { name: 'rent', cost: 500 },
//   { name: 'bills', cost: 300 },
//   { name: 'gaming', cost: 200 }
// ])
// // console.log(angles)
