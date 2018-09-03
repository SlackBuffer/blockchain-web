- https://css-tricks.com/css-modules-part-1-need/
- https://css-tricks.com/css-modules-part-2-getting-started/
    - webpack loader configs
# `react-css-modules`
- 纯 CSS modules 问题
    1. CSS 名必须 `camelCase`
    2. 必写 `style.` 前缀
    3. Mixing CSS Modules and global CSS classes is cumbersome
    4. Reference to an undefined CSS Module resolves to `undefined` without a warning
- `react-css-modules`
    1. CSS 名可以不是 `camelCase`
    2. `styleName`
    3. 全局 CSS 和 CSS modules 区分明显：`<div className='global-css' styleName='local-module'></div>`
    4. warned (`handleNotFoundStyleName` option)
    5. You can enforce use of a single CSS module per ReactElement (`allowMultiple` option)
- 实现
    - `react-css-modules` extends `render` method of the target component. It will use the value of `styleName` to look for CSS Modules in the associated styles object and will append the matching unique CSS class names to the `ReactElement className` property value.
- https://blog.pusher.com/css-modules-react/
- `modules: true` turn on css modules mode
- `sourceMap: true` turn on map (even for scss)