- [ ] media query 要用 em，why
    - [ ] 用 em 后 rem 不在参照根元素的 font-size
- z-index 只在设定了 position 后才有效
- select

    ```css
    .paragraph:not(:last-of-type) {
        margin-bottom: 2rem;
    }
    ```

- 图片默认 inline，不设成 block 下方会有小间隙 
- svg icons
    - https://iconmoon.io
- css custom property
- `fill: currentColor`
- http://cubic-bezier.com/
# flexbox
- 无需知道盒子尺寸
- 适用于一维布局
- flex container: `display: flex;`, `display: flex-inline` （很少用到）
- flex container 的直接子元素称为 flex items
- flex 排列方向上的轴称为 main axis，与之垂直的是 cross axis
## flexbox properties overview
- 069
- https://codepen.io/slackbuffer/pen/WKwMro?editors=1100#0
### container
- flex-direction: **row** | row-reverse | column | column-reverse
    - 即 main axis 的方向
    - 小屏的 media query 触发时可以设为 column
- flex-wrap: **nowrap** | wrap | wrap reverse
- justify-content: **flex-start** | flex-end | center | space-between | space-around | space-evenly
    - 决定 flex items 在 main axis 上的排列方式
    - center: 居中，item 间的距离由 margin 决定
    - space-between: item 间的距离相等
    - space-around: 在每个 item 的两侧设置相同宽度的空间
    - space-evenly: item 和 container、item 和 item 之间的距离都相等
- align-items: **stretch** | flex-start | flex-end | center | baseline
    - 决定 flex items 在 cross axis 上的排列方式
    - 决定其它 item 与 container 中最高的 item 的对齐方式 
    - baseline: 对齐各 item 的文本
- align-content: **stretch** | flex-start | flex-end | center | space-between | space around
    - 用于 flex items 有多行的情况，决定行在 cross axis 上的排列方式
### item
- align-self: **auto** | stretch | flex-start | flex-end | center | baseline
- order: **0** | `<integer>`
    - 决定 item 在 container 中的顺序
    - 默认为 0，越小越靠前
- flex-grow: **0** | `<integer>`
    - 使 item 尽可能占据更多空间，余下的 item 占据剩下的空间
        - 只需设置 `flex: 1;`
    - 值大小仅在有参照时有意义
- flex-shrink: **1** | `<integer>`
    - 1 表示可以缩小；0 表示不能缩小
- flex-basis: **auto** | `<length>` 
    - 决定 base width
    - 设置后该 item 将占据设置的空间
- flex: 0 1 auto | `<int>` `<int>` `<int>`
# emmet
- `.container>.item*5`