- `npm install`
- > https://cdn.bootcss.com/bootstrap/4.1.1/css/bootstrap.css
# key words
## components/Home.js
- basic `prop-types`
- `this.props.children`
- `this` binding
    - ES6 arrow function
    - ES5 `bind`
    - 是否要 bind `this` 看函数内部是否用到 `this`
- 虚拟 DOM 效果
    - more tools - rendering - paint flashing (highlight areas of the page (green) that need to be repainted)
- `constructor` 做初始化工作
- 子组件向父组件传值
- 兄弟组件间传值
- 双向数据绑定：view 和 model 互相响应变化
## components/Header.js
- 无状态组件
    - 无需 state，即不处理用户输入，组件所有数据由 props 传入
    - 不需要用生命周期函数
    - > 后期要处理状态或加生命周期函数，就用**高阶组件** hoc，返回组件的组件（返回组件的函数）
- [**生命周期函数**](https://reactjs.org/docs/react-component.html)
# Issues
- index.js:2178 Warning: Home contains an input of type text with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components
- `setState` 同步更新策略
    - > https://segmentfault.com/a/1190000008051628