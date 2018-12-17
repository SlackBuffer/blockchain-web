const dims = { height: 500, width: 1100 }

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 100)
  .attr('height', dims.height + 100)

const graph = svg.append('g')
  .attr('transform', 'translate(50, 50)')

// data strat
const stratify = d3.stratify()
  .id(({ name }) => name)
  .parentId(({ parent }) => parent)

const tree = d3.tree()
  .size([dims.width, dims.height])

const color = d3.scaleOrdinal(d3['schemeSet3']) // range)

const update = data => {
  // remove current nodes (dirty)
  graph.selectAll('.node').remove()
  graph.selectAll('.link').remove()

  // console.log(data)
  color.domain(data.map(({ name }) => name))

  // get updated root node data
  const rootNode = stratify(data)
  const treeData = tree(rootNode)
  // console.log(treeData) // `x`, `y`

  // get nodes selection and join data
  const nodes = graph.selectAll('.node')
    .data(treeData.descendants())

  // get link selection and join data
  const links = graph.selectAll('.link')
    .data(treeData.links())
  console.log(treeData.links())

  // enter new links
  links.enter()
    .append('path')
    // .transition().duration(300)
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical()
        .x(({ x }) => x)
        .y(({ y }) => y)
      )

  // create enter node groups
  const enterNodes = nodes.enter()
    .append('g')
      .attr('class', 'node')
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`)

  // append rects to enter nodes
  enterNodes.append('rect')
    .attr('fill', ({ data: { department }}) => color(department))
    .attr('stroke', '#555')
    .attr('stroke-width', 2)
    .attr('height', 50)
    .attr('width', ({ data: { name } }) => name.length * 20)
    .attr('transform', ({ data: { name }}) => `translate(${-name.length * 10}, -25)`)

  // append name text
  enterNodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text(({ data: { name }}) => name)
}

let data = []
db.collection('employees').onSnapshot(res => {
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