# Brief
- [] `BizCharts.track(false)`
- 在 BizCharts 中，图表是由各个组件组合而成的，有两种类型，实体组件和抽象组件
    1. 实体组件：在图表上有对应的图形、文本显示
    2. 抽象组件：没有显示，是一种概念抽象组件（坐标系组件 `<Coord />`，视图组件 `<View />`，分面组件 `<Facet /`>`）
# API
## `<Chart />`
- 图表父组件，所有的其他组件都必须由 `<Chart>` 包裹
- `height` 单位为 `px`
- `forceFit` 取示例的容器的宽度，此时 `width` 不生效
## `<Axis />`
- 坐标轴组件
## `<Geom />`
- 几何标记组件，即点、线、面等集合图形
- `position`
### `<Label />`
- 几何标记的辅助文本组件，必须作为 `<Geom />` 的子组件
## `<Tooltip />`
- 提示框组件
## DataSet