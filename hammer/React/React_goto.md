- UI = Component(props, state)
- React 元素是普通的 JS 对象
- 组件和元素

    ```js
    const button = <Button />;
    // Button 是组件，button 是一个代表组件 Button 的 React 元素
    ```

- DOM 事件中可以通过 `return false;` 阻止事件的默认行为， React 事件需调用事件对象的 `preventDefault` 方法来阻止事件的默认行为
    - 必须使用 DOM 提供的原生事件的场合，可以通过调用事件对象的 **`nativeEvent`** 属性获取
- 若直接在 `render` 方法中为元素定义事件处理函数，每次 `render` 调用都会重新创建一个新的事件处理函数，带来额外开销，组件所处层级越低，开销越大，任何一个上层组件的变化都可能触发该组件的 `render` 方法
- `onClick={this.handleClick.bind(this, item)}` 
- property initializer syntax
    - create-react-app 默认支持
    - 可自行引入 babel 的 transform-class-properties
- 非受控组件
    - 元素根据用户输入自动改变显示的内容，而不是从组件状态中获取显示的内容
    - 用 `defaultValue` 属性指定默认值
- 受控组件
    
    ```jsx
    <select value={this.state.value}>
      <option value='react'>React</option>
      <option value='mobx'>Mobx</option>
    </select>

    // 复选框
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.checked });
    }
    ```

- `render` 支持返回字符串和由 React 元素组成的元素
- React 16 会把不识别的属性也传给 DOM 元素
# 样式
- 外部样式表的两种引入方式
    1. 在使用组件的 HTML 页面中通过标签引入
        - 常用于样式表作用于整个应用的情况
        - 全局样式也可在入口 JS 文件中引入
    2. 在使用样式表的组件中把样式当作模块导入
- create-react-app 将 `public` 下的文件配置成可以在 HTML 页面中直接引用，全局样式表可放在 `public` 目录下
    - 组件的样式表放在 `src` 中
# 生命周期
- 只需在构造器中调用 `super(props)` 才能保证 `props` 被传入组件中
- **`render` 不负责组件的实际渲染工作，它只返回一个 UI 的描述，渲染页面 DOM 的工作由 React 自身负责**
- `render` 是纯函数，不能执行有副作用的操作，如 `this.setState`
- <u>**`props` 引起的组件更新，本质上是由渲染组件的父组件引起的**</u>
    - 无论 `props` 是否改变，父组件 `render` 方法每一次调用都会导致组件更新
- 在 `componentWillReceiveProps` 中调用 `setState`，只有在组件 `render` 及其之后的方法中， `this.state` 才指向更新后的 `state`，`render` 之前的方法（`shouldComponentUpdate`, `componentWillUpdate`）的 `this.state` 依然指向更新前的 `state`
# 虚拟 DOM, Diff
- 虚拟 DOM 是普通的 JS 对象
- React 使用 `key` 属性来标记列表中的每个元素，列表数据发生变化时，通过 `key` 可以得到变化的元素，从而只重新渲染发生变化的元素
    - `key` 值没有变化，React 就认为是同一个节点；用数组索引作为 `key` 不好，一旦数组元素顺序变化，会有大量 `key` 失效
- 列表元素的 `key` 不能重复，此唯一性仅限于当前列表中
# 语法
- 箭头函数的 `this` 指向函数定义时的所在的上下文对象，不是函数执行时的上下文对象
- 解构赋值

    ```js
    # 数组参数解构
    const sum = ([x, y]) => x + y;
    sum([1, 2]);    // 3
    ```

- JSX 只能使用 JS 表达式，不能使用多行 JS 语句
- JSX 是 `React.createElement(component, props, ...chilren)` 的语法糖
# 套路
- 编辑状态时使用 `textarea` 展示

    ```jsx
    <div className="title">
      {this.state.editing
        ? <form>
            <textarea />
          </form>
        : title }
    </div>
    ```

- 与服务器通信一般在 `componentDidMount` 和 `componentWillMount` 中进行
    - `componentWillMount` 中进行通信比后者能更快拿到数据，但快的程度基本可忽略
    - `componentDidMount` 中执行组件，DOM 已挂载，可以安全地操作 DOM
    - 组件在服务端渲染时， `componentWillMount` 会被调用两次（服务端一次浏览器一次），`componentDidMount` 会保证执行一次
# `ref`, `context`
- React 提供一个特殊的属性 `ref` 用来引用 React 组件或 DOM 元素的实例
- `ref` 值是一个函数，接受当前元素作为参数

    ```jsx
    <input type="text' ref={ input => this.input = input}>
    ```

- 创建 `context` 的方式
    - 在提供 `context` 的组件中，新增一个 `getChildContext` 方法，返回 `context` 对象；在该组件的 `childContextTypes` 属性上定义 `context` 对象的里要传递的属性的类型信息
    - 在使用 `context` 的组件的 `contextTypes` 声明要使用的 `context` 属性，要使用的地方用 `this.context.propName` 去调用

    ```jsx
    class Provider extends React.Component {
        getChildContext() {
            return { onAddUser: this.handleAddUser }
        }
    }
    Provider.childContextTypes = {
        onAddUser: PropTypes.func
    }

    class Consumer extends React.Component {
        handleClick() {
            this.context.onAddUser();
        }
    }
    UserAdd.contextTypes = {
        onAddUser: PropTypes.func
    }
    ```

    - 父组件的 `state` 变化会创建一个新的 `context`，重新传递给子组件
# Portal
- Potals 特性可以把组件渲染到当前组件树以外的 DOM 节点
    - 典型应用场景是渲染应用的全局弹窗，任意组件都可以讲弹窗组件渲染到跟节点上
# 设计
## `state`
- `state` 必须代表一个组件 UI 呈现的最小状态集
    - 分两类数据
        1. 渲染组件的数据源
        2. 组件 UI 展现形式的判断依据
- 组件的普通属性：除 `state`，`props` 外的组件属性
    - `state`，`props` 是 React 在 Component class 中预定好的组件属性
    - 普通属性（如 timer）不要放在 `state` 中，放在构造器中（`this.timer = null`）
        - 与组件的渲染无关的属性要定义为组件的普通属性，直接挂载到 `this` 下，而不是作为组件的 `state`
        - 判断依据是组件 `render` 有没有用到该变量
- 装量是否作为 `state` 判据
    1. 是否通过 `props` 从父组件获取
    2. 是否在组件的整个生命周期中都保持不变
    3. 是否可以通过其他 `state` 或 `props` **计算**得到
    4. 是否在组件的 `render` 方法中使用
- `state` 设计成不可变对象，`shouldComponentUpdate` 只需比较两次状态的引用就可以判断状态是否发生改变
    - `concat`，`slice`，`filter` 返回新数组
### `state` 更新
- `setState` 把要修改的状态放入一个队列，React 会优化执行时机，出于性能原因可能会将多次 `setState` 状态修改合并成一次，即**异步**更新

    ```js
    // 连续点两此按钮
    // 多次修改合并成一次，后一次操作覆盖前一次，最终只 +1
    Object.assign(
        previousState,
        { quantity: this.state.quantity + 1},
        { quantity: this.state.quantity + 1}
    );

    // 正确写法
    this.setState((preState, props) => ({
        counter: preState.quantity + 1;
    }));
    // preState 是当前最新状态（本次组件状态修改后生效的状态）的前一个状态，即本次组件修改前的状态
    // props 是当前最新的 props
    ```

    - [ ] 何时会合并
    - [ ] 如何强制更新
- 不要依赖当前的 `state` 计算下一个 `state`，依赖的 `this.state` 不能保证是最新
- 同样不能依赖当前 `props` 计算下一个状态，`props` 的更新也是异步的
- `state` 是**合并**的过程，只需传入发生改变的字段