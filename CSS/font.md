- 字体分不同类别（font collection），包括衬线字体（serif），无衬线字体（sans-serif），等宽字体（monospace）
- 每一类字体分为不同字体族（font family），如 Times，Helvetica
- 字体族包含不同字型（font face），如 Times Roman、Times Bold、Helvetica Condensed、Bodoni italic
- 字体属性主要描述一类字体的大小和外观，如使用的字体族，自豪大小，粗体、斜体
- 文本属性描述对文本的处理方式，如行高，字符间距，下划线，缩进
- “x 高度”指英文字母不包含(字母 d 和 p 都有的)上伸部分和下伸部分的主要区域， 恰好 x 没有这些部分，所以就用它的高度来度量
- 字体族是可继承属性
- 常用字体栈
    - verdana，tahoma，sans-serif
    - helvetica，arial，sans-serif
- 字体大小可继承
- 浏览器样式表默认为每个 HTML 元素都设定了 `font-size`，因此在设定 `font-size` 时实际是在修改默认值
    - 浏览器样式表在设定所有元素的字体大小时使用的都是相对单位 `em`
- 若为某个元素设定了相对字体大小（em），则该元素的字体大小以相对于最近的“设定过字体大小的”祖先元素来确定
- rem（root em）相对于 HTML 根元素

    ```css
    p {font-size:14px; font-size:875rem;}   /* 不支持的用 14px */
    ```

- `font-style`
    - 设定字体是斜体还是正体
    - `normal` 属性值可用于恢复默认属性值
- `font-weight`
    - 设置字体粗细
    - 最好只用 `bold` 和 `normal` 两个值
        - 数字值没有什么用，对浏览器来说， 它只显示 `font-weight` 属性的两个值：`bold` 和 `normal`
    - 从常规字体到粗体的切换可能发生在不同的数值上，通常是 400 左右
- `font-variant`
    - 除 `normal` 外只有 `small-caps`，把小写英文字母变成小型大写字母
- 简写字体属性
    1. 必须声明 font-size 和 font-family 的值
    2. 所有值必须按如下顺序声明
        1. font-weight、font-style、font-variant 不分先后
        2. 然后是 font-size
        3. 最后是 font-family
    - 在设定 font-size 属性的同时，可以顺便设定 line-height（行高）值（如 12px/1.5）
- `text-indent`
    - 设置文本缩进
    - [长度值可正可负](demo/stylin3_code_files/chap4_code_files/text-indent.html)
    - text-indent 属性设定行内盒子相对于包含元素的起点，默认情况下，这个起点就是包含元素的左上角
    - 可被子元素继承
        - 子元素继承的是祖先元素中计算的值，而非设定的值
        - 400px 的 div，文本缩进 5%；div 中 200px 宽的段落，继承的缩进值不是 5%，而是 20px
    - 文本盒子跨行时是断开的，只有第一行开头和最后一行末尾是封闭的
        - 只缩进段落第一行用 text-indent，缩进整个段落用 `margin-left`
- letter-spacing
    - 字符间距，可正可负
    - letter-spacing 控制字距（tracking），即文本块中所有字符之间的间距
        - 与字距相对的一个排版术语叫字紧排（kerning），紧排只调整两个字符的间距
    - letter-spacing 的值是在浏览器默认值基础上增加或减少的值
- text-decoration
    - underline，overline，line-through，blink，none
- text-align
    - left，right，center，justfy
- line-height
    - 行高，任何数字值，不用指定单位
    - CSS 中的行高平均分布在一行文本的上方和下方
        - 字体大小 12px，行高 20px，浏览器会在文本上方和下方各加 4px 的空白
        - 行高不叠加（不像外边距）
        - `font:1.2em/1.4` 行高是 1.2em 的 1.4 倍
    - 有时候把标题的内外边距都去掉，标题上下仍会有空白，此时可把文本行高设定为比字体高度（即字体大小）小的值，如小于 1 的值
- text-transform
    - 文本转换
    - none，uppercase，lowercase，capitalize
- vertical-align
    - 任意长度值及 sub，super，top，middle，bottom
- [简单的文本布局](demo/stylin3_code_files/chap4_code_files/简单的文本布局.html)
- [基于网格排版](demo/stylin3_code_files/chap4_code_files/基于网格排版.html)
- [经典排版练习](demo/stylin3_code_files/chap4_code_files/经典排版练习.html)