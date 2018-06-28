- 每个元素被看成一个矩形框
- 组成：
    1. content
    2. padding（内边距）
    3. border
    4. margin（外边距）
- `outline` 属性适用于 debug，效果和边框相同不影响元素的宽高
- 默认情况下，`width` 和 `height` 指的只是 content 的宽高
    - `box-sizing: content-box;`
- 设置成 `box-sizing: border-box;` 后， `width` 和 `height` 包括 content，padding 和 border
- block 元素
    - 占一行
    - 高度由 content 决定
        - 无内容则无高度
- inline 元素
    - 占 content 的尺寸
    - 不能设置宽高，仅左右 margin，border，padding 有效
        - `<img>` 表现得更像 inline-block 元素，可设置宽高，各方向 margin，border，padding 均有效
- inline-block 元素
    - inline 布局, block 模式
    - 表现为 inline，可以设置宽高，padding，margin，border
- **外边距叠加**：两个或多个垂直外边距相遇时，将形成一个外边距，其高度为两个发生叠加的外边距的较大值
    - 一个元素包含在另一个元素中时（父元素没有内边距或边框将自身的外边距和子元素的外边距隔开时），也会发生外边距叠加
    - 空元素的顶外边距和底外边距也会发生叠加（没有边框和内边距隔开时）
        - 已经叠加的外边距还会和另一个空元素的外边距发生叠加
- 只有**正常文档流**中 block box 的**垂直外边距**才会发生外边距叠加
    - inline box，floated box 或绝对定位的 box 的外边距不会叠加
- 父元素没有上、下边框的情况下，子元素的上、下外边距会折叠
# collapsing margins(w3)
- 相邻的垂直外边距会发生叠加
    - 跟元素盒子的外边距不叠加
    - 若一个带 clearance 的元素的顶外边距和底外边距相邻，它的外边距会与随后紧跟的兄弟元素的外边距发生叠加，得到的叠加后的外边距不再与父元素的底外边距发生叠加
- 水平外边距不叠加
- 外边距只在一下情况下是相邻的（adjoining）
- https://segmentfault.com/a/1190000010346113
- https://www.w3.org/TR/CSS2/box.html#collapsing-margins
- http://www.zhangxinxu.com/wordpress/2010/01/css-float%E6%B5%AE%E5%8A%A8%E7%9A%84%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6%E3%80%81%E8%AF%A6%E8%A7%A3%E5%8F%8A%E6%8B%93%E5%B1%95%E4%B8%80/\
- http://www.cnblogs.com/dolphinX/p/3236686.html
# BFC(w3)
- 浮动元素，绝对定位元素，不是块级元素的块级容器（如 inline-blocks，table-cells，table-captions），`overflow` 属性值不是 `visible` 的块级元素（`visible` 属性值已被传到 viewport 的情况除外）为它们的内容创建了一个新的块级格式上下文
- 在一个块级格式上下文里，从容器盒子顶部开始盒子在垂直方向上一个挨着一个布局；兄弟盒子垂直方向的距离由 `margin` 属性决定；相邻的块级盒子会发生外边距叠加；每个盒子的左侧边缘接触到包含容器块的左侧边缘（右到左的格式反之），甚至在存在浮动时仍然是这样