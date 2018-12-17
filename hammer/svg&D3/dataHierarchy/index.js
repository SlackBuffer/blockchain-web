const data = [
  { name: 'news', parent: '' },

  { name: 'tech', parent: 'news' },
  { name: 'sport', parent: 'news' },
  { name: 'music', parent: 'news' },

  { name: 'ai', parent: 'tech', amount: 7 },
  { name: 'coding', parent: 'tech', amount: 5 },
  { name: 'tablets', parent: 'tech', amount: 4 },
  { name: 'laptops', parent: 'tech', amount: 6 },
  { name: 'd3', parent: 'tech', amount: 3 },
  { name: 'gaming', parent: 'tech', amount: 3 },

  { name: 'football', parent: 'sport', amount: 6 },
  { name: 'hockey', parent: 'sport', amount: 3 },
  { name: 'baseball', parent: 'sport', amount: 5 },
  { name: 'tennis', parent: 'sport', amount: 6 },
  { name: 'f1', parent: 'sport', amount: 1 },

  { name: 'house', parent: 'music', amount: 3 },
  { name: 'rock', parent: 'music', amount: 2 },
  { name: 'punk', parent: 'music', amount: 5 },
  { name: 'jazz', parent: 'music', amount: 2 },
  { name: 'pop', parent: 'music', amount: 3 },
  { name: 'classical', parent: 'music', amount: 5 },
];

const stratify = d3.stratify()
  .id(({ name }) => name)
  .parentId(({ parent }) => parent)

// console.log(stratify(data))

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 1060)
  .attr('height', 800)
const graph = svg.append('g')
  .attr('transform', 'translate(50, 50)') // to give a 50px margin

const rootNode = stratify(data)
  .sum(({ amount }) => amount) // sum based on certain prop; generates a `value` on each parent node

const pack = d3.pack()
  .size([860, 700])
  .padding(5)

// console.log(pack(rootNode))  // generate a `r`, `x`, `y` on each node
// console.log(pack(rootNode).descendants()) // convert nested objects back to data arrays

const bubbleData = pack(rootNode).descendants()

// create ordinal scale
const color = d3.scaleOrdinal(['#d1c4e9', '#b39ddb', '#9575cd' ])

// each bubble is a group element with text, circle ...

// join data and add group for each node
const nodes = graph.selectAll('g')
  .data(bubbleData)
  .enter()
  .append('g')
  .attr('transform', ({ x, y }) => `translate(${x}, ${y})`)
nodes.append('circle')
  .attr('r', ({ r }) => r)
  .attr('stroke', 'white')
  .attr('stroke-width', 2)
  .attr('fill', ({ depth }) => color(depth))

nodes.filter(({ children }) => !children)
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '0.3em') // offset in y direction
  .attr('fill', 'white')
  .style('font-size', ({ value }) => value * 5)
  .text(({ data: { name }}) => name)