- [ ] `a:link`, `btn:link`
- > `clip-path` code generator
    - http://bennettfeely.com/clippy/
---
- architect mindset
    1. responsive design
        - fluid layouts, media queries, responsive images, correct units, desktop-first vs mobile-first
    2. maintainable and scalable code
        - clean, easy-to-understand, growth, reusable, how to organize files, how to name classed, how to structure HTML
    3. web performance
        - less HTTP requests, less code, compress code, use a CSS preprocessor, less images, compress images
- clean, modular, reusable, ready for growth
- think-build-architect mindset
    1. think about the layout of webpage before writing code
    2. build layout in HTML and CSS with a consistent structure from naming classes
    3. create a logical architecture for CSS with files and folders
- BEM
    - block: standalone component that is meaningful on its own, can be reused anywhere in the project
        - block can be nested
    - element: part of a block that has no standalone meaning
        - 如特定尺寸、位置的图片的 class
    - modifier: a flag to specify a different version of a block or an element
- cascade and specificity
    - importance > specificity > source order
        - importance
            1. user `!important` declarations (how to write??)
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
    - `*` has (0,0,0,0) for specific value
    - **依赖具体性而不要依赖顺序**
    - > CSS from user: for instance when the user changes the default font size in the browser
    - > **若普通状态下的选择性比 `:hover` 时的选择性高，`:hover` 时的 class 不会被应用**
- how css values are processed
    1. declared value (author declarations)
    2. cascaded value (after cascade takes effect)
    3. specified value (defaulting, if there is no cascaded value)
    4. computed value (converting relative values to absolute)
        - value with relative units are converted to pixels so that they can be inherited
        - CSS keywords like "orange, bolder" are computed and replaced here
    5. used value (final calculations, based on layout)
    6. actual value (browser and device restrictions)
        - for instance, 184.8px => 185px
- relative size
    - font: 相对于父元素
    - length (height, padding, margin 等)：相对于父元素的 **`width`**
    - **font-based**
        1. em **(font)**：相对于**父元素的** font-size
        2. em **(lengths)**：相对于**自身**的 font-size
        3. rem：相对于 root font-size, **1rem is exactly the root font size**
- In each element on the page, each and every CSS property must have a value, even if neither the developer nor the browser do specify it (in that case, there's no cascaded value)
    - CSS engine asks if there's a **cascaded value**
        1. yes: specified value === cascaded value
        2. no: ask if the property can be inherited
            1. yes: specified value === **computed value** of parent element
            2. no: specified value === **initial value** (specific to each property; no need to memorize, quite intuitive)
- **inheritance**
    <!-- - 每个 css 属性都有 initial value
        - 可继承属性在开发者、用户和浏览器都未指定值，且没有发生继承时才会用到初始值
        - 不可继承属性在未指定值时被设置为初始值 -->
    - 继承（若该属性可继承）仅在（开发者，浏览器）未给属性指定值时才生效（即没有 cascaded value 时）
        - 推知浏览器并未给所有属性指定默认值
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
            - element is removed from normal flow and shifted to the left or right as far as possible, util it touches the edge of its containing box, or another floated element
            - text and inline elements will wrap around floated element
            - container will not adjust its height to the element (use clearfix to fix this)
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
- **`transition` 要放在 initial state 上**
# Float
# SASS
- 两种 SASS 语法：SCSS 写法更类似 CSS；SASS 用缩进
- Main SASS features
    - Variables, nesting, operators, partials and imports
    - Mixins: to write reusable pieces of CSS code
    - Functions: similar to mixins, with the difference that they produce a value that can be used
    - Extends: to make different selectors inherit declarations that are common to all of them
    - Control directives: for writing complex code using conditional and loops (more for CSS frameworks)
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