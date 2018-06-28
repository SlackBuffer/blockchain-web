- `em` 表示一种字体下字母 M 的宽度，`ex` 是当前字体下字母 x 的高度
- 通过 `rrggbb` 中每一对 rgb 值中的第一个值可大致判断颜色
- HSL(%0, %0, %0)
    - H：色相，即实际的颜色
    - S：饱和度，灰色的第，鲜艳的高
    - L：亮度
    - > 饱和度和亮度设为 50% 可轻松调色
- RGB 和 HSL 都支持 Alpha 通道，用于设置颜色不透明度
    - 1 完全不透明，0 完全透明
- 简写属性：**顺时针旋转**

    ```css
    {border:4px solid red;}     /* 先给 4 条边设置相同的样式 */ 
    {border-left-width:1px;}    /* 修改左边框宽度 */ 
    {border-right:none;}        /* 移除右边框 */
    ```

- `* {margin: 0; padding: 0}` 把浏览器的默认内外边距去掉，手动加上真正需要的，可以保持跨浏览器一致性
- 文本元素的左右外边距用像素，上下外边距用相对尺寸（如 `em`）
- `overflow: hidden` 两用
    1. 防止包含元素被超大内容撑大，容器元素保持其设定的宽度，过大的子内容则会被容器剪切掉
    2. 迫使父元素 包含其浮动的子元素
- `display: none;` 不占空间，`visibility: hidden;` 元素隐藏、仍占空间
- 简写
    - [ ] `font: 24px/150px helvetica, arial, sans-serif;`
- 在 HTML 标记中，必须把所有和号 `&` 和小于号 `<` 都替换成相应的 HTML 实体，也就是 `&amp;` 和 `&lt;`
    - 因为 `&` 是实体的第一个字符，而 `<` 是 HTML 标签的第一个字符，它们都有特殊含义
    - 如果不替换的话，浏览器一看到它们就会当成实体和标签来解释后面的内容
- HTML 实体
    - http://htmlhelp.com/reference/html40/entities/special.html
    - http://code.iamkate.com/html-and-css/character-entity-references-cheat-sheet/
    - 伪元素中的 HTML 实体值需改写成此种形式 `e::before {content:"\201C";}`，对应的十六进制值为 `&#x201C;`（左双引号）