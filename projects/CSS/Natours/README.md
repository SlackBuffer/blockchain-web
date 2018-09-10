- [ ] `a:link`, `btn:link`
- > `clip-path` code generator
    - http://bennettfeely.com/clippy/
---
- architect mindset
    1. responsive design
    2. maintainable and scalable code
    3. web performance
    - clean, modular, reusable, ready for growth
- BEM
    - block: standalone component that is meaningful on its own
    - element: part of a block that has no standalone meaning
    - modifier: a flag to specify a different version of a block or an element
- relative size
    - font: 相对于父元素
    - length (height, padding, margin 等)：相对于父元素的 **`width`**
    - **font-based**
        1. em (font)：相对于父元素的 font-size
        2. em (lengths)：相对于**自身**的 font-size
        3. rem：相对于 root font-size
- cascade and specificity
    - importance > specificity > source order
        - importance
            1. user `!important` declarations
            2. author `!important` declarations
            3. author declarations
            4. user declarations
            5. default browser declarations
        - specificity
            1. inline styles
            2. ids
            3. classes, **pseudo-classes**, attribute
            4. elements, **pseudo-elements**
        - source order
            - 最后写的那个会被应用
    - `!important` 不得已再用
    - 1 个 id 比 1000 个 class 都具体；1 个 class 比 1000 个 element 都具体
    - **依赖具体性而不要依赖顺序**
- how css values are processed
    1. declared value (author declarations)
    2. cascaded value (after the cascade)
    3. specified value (defaulting, if there is no cascaded value)
    4. computed value (converting relative values to absolute)
    5. user value (final calculations, based on layout)
    6. actual value (browser and device restrictions)
- inheritance
    - 每个 css 属性都有 initial value
        - 可继承属性在开发者、用户和浏览器都未指定值，且没有发生继承时才会用到初始值
        - 不可继承属性在未指定值时被设置为初始值
    - 继承仅在未给属性指定值时才生效
    - 继承的是 **computed value**（不是 declared value）
    - 可以用 `inherit` 关键字强制继承
    - `initial` 关键字可用来将属性重置回初始值
- visual formatting model
    - > algorithm that calculates boxes and determines the layout of these boxes, for each element in the render tree, in order to determine the final layout of the page 
    1. Dimensions of boxes: the box model
        - fill area: content, padding, border
            - background image 和 background color 会填充盒子的 fill area
        - 不为盒子设置宽高，vfm 会根据 content 来决定盒子的大小
        - `box-sizing: border-box`: width 和 height 由 content，padding，border 构成
    2. Box type: inline, block, inline-block
        - block-level boxes: `display: block`, `display: flex`, `display: list-item`, `display: table`
        - inline boxes: no heights and widths; paddings and margins only horizontal
        - inline-block boxes 
    3. Positioning scheme: floats and positioning
        1. normal flow: 分 default 和 `position: relative`
        2. floats
            - element is removed from normal flow
            - text and inline elements will wrap around floated element
            - container will not adjust its height ot the element (use clearfix to fix this)
        3. absolute positioning: `position: absolute`, `position: fixed`
            - element is removed from normal flow
            - use `top`, `bottom`, `left`, `right` to offset the element from its relatively positioned container
            - no impact on surrounding content or elements
    4. Stacking contexts
        - `z-index` 大的在上面
        - 非零的 `opacity` 值，transform，filter 等其他属性也会创建新的 stacking context
    5. Other elements in the render tree (siblings, parents)
    6. Viewport size, dimensions of images, etc.
- responsive design principles
    1. fluid grids and layouts
        - user `%` rather than `px` for all layout-related lengths
        - layout types: float, flexbox, css grid
    2. flexible/responsive images
    3. media queries
- `transition` 要放在 initial state 上
# Float
# SASS
- 两种 SASS 语法：SCSS 写法更类似 CSS；SASS 用缩进
- demo
    - https://codepen.io/slackbuffer/pen/ZjWQga?editors=1100
        1. float, clear-fix
        2. 嵌套（包括伪类）
        3. 变量
        4. 内置方法：`darken`, `lighten`
        5. mixins: 一堆可复用的代码
            - 可传参
            - 在目标位置引用代码
        6. 自定义方法
        7. extends: 少重复写选择器
            - sass 保持 DRY 而不是编译后生成的 css 保持 DRY
            - 将选择器加到 extends 的 css rule 上
            - 存在内在或主题关联性时才使用