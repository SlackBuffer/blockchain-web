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
- _grid.scss
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
- extends 拷的是选择器，`%extendedPlaceholder {}` 被使用 `extends` 的选择器替代（提上去）；mixin 拷的是代码（025）
- > https://scotch.io/tutorials/how-to-use-sass-mixins
# Emmet
- `.composition>(img.composition__photo.composition__photo--p1)*3`
# Natours
- `.btn:link, btn:visited {}`
- animations
    - `backface-visibility: hidden;`
    - transition; `@keyframe`
    - 008
- `::selection`
- clip-path effect
    1. `clip-path`
    2. `skewX`
    3. `background-image: linear-gradient(105deg, rgba($color-white, .9) 0%, rgba($color-white, .9) 50%, transparent 50%),  url('../img/nat-10.jpg');`
- Cannot style default radio button
    - Trick: define our own; hide the default one (the default one will still get selected)
- Use `<button>` to submit instead of a `<a>`
# Icon fonts
- Doesn't matter use what element tag, so use `<i>` as a convention
# Media queries
- `@media only screen and ()`
- SASS 的 media query 可嵌套写
- Media queries don't add any importance or specificity to selectors, so code order matter - keep media queries at the end
- Desktop first: `max-width`
  - 先设计 PC 端，宽度小于某个 width 的，设个 `max-width` 断点，应用其他样式
- Mobile first: `min-width`
- Selecting breakpoints
  1. Based on multiple devices
    - < 600, phone only
    - [600, 900], tablet portrait
    - [900, 1200], tablet landscape
    - [1200, 1800], desktop (normal)
    - > 1800, big desktop
  2. Content based
- In media queries, em and rem are **not affected by the root font size setting** (`html { font-size: 625%; }`). 1em or 1rem is always equal to the font size coming from the browser (by default 16px)
- [ ] `em` are the best option for media queries
  - `rem` does not work as intended in some browsers
- Base + typography > general layout + grid > page layout > components
## Responsive images
- Use `em`
- Resolution switching
  - Decrease image resolution on smaller screen
  - `<img srcset="logo-1x.png 300w, logo-2x.png 2x 1000w" sizes="(max-width: 900px) 20vw, (max-width: 600px) 30vw, 300px" src="logo.png" />`
    - `w` - width of the image
    - `sizes` informs the browser about the approximate width of the image at different viewport width
    - `src` as a fallback
- Density switching
  - 1x, 2x (same image)
  - 2x resolution screens use two physical pixels (actual image) to display one pixel on the page
  - `<img srcset="logo-1x.png 1x, logo-2x.png 2x" />`
- Art direction
  - Serve completely different images on different screens
  - `<source srcset="logo-1x.png 1x, logo-2x.png 2x" media="(max-width: 37.5em)" />`
- In CSS
  - `@media (min-resolution: 192dpi) and (min-width: 600px), (max-width: 2000) {}`
  - `,` means or
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
    - Without it, the browser will basically zoom out the page, so that the largest version of the page fits the screen (widest element)
- `@media only screen and (hover: none) {}`
  - For devices that cannot hover
## Graceful degradation
- `@supports(css rule)`
- https://css-tricks.com/ordering-css3-properties/#article-header-id-0

continues at 48