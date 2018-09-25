- UI = Component(props, state)
- React 元素是普通的 JS 对象
- 组件和元素

    ```js
    const button = <Button />
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
        this.setState({ [e.target.name]: e.target.checked })
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
- 在构造器中调用 `super(props)` 才能保证 `props` 被传入组件中
- **`render` 不负责组件的实际渲染工作，它只返回一个 UI 的描述，渲染页面 DOM 的工作由 React 自身负责**
- `render` 是纯函数，不能执行有副作用的操作，如 `this.setState`
- <u>**`props` 引起的组件更新，本质上是由渲染组件的父组件引起的**</u>
    - 无论 `props` 是否改变，父组件 `render` 方法每一次调用都会导致组件更新
- 在 `componentWillReceiveProps` 中调用 `setState`，只有在组件 `render` 及其之后的方法中， `this.state` 才指向更新后的 `state`，`render` 之前的方法（`shouldComponentUpdate`, `componentWillUpdate`）的 `this.state` 依然指向更新前的 `state`
# 虚拟 DOM, Diff
- 虚拟 DOM 是普通的 JS 对象
- React 使用 `key` 属性来标记列表中的每个元素，列表数据发生变化时，通过 `key` 可以得到变化的元素，从而只重新渲染发生变化的元素
    - `key` 值没有变化，React 就认为是同一个节点；用数组索引作为 `key` 不好，一旦数组元素顺序变化，会有大量 `key` 失效
- 列表元素的 `key` 不能重复，此唯一性仅限于**当前列表**中
# 语法
- 箭头函数的 `this` 指向**函数定义时的所在的上下文对象**，不是函数执行时的上下文对象
- 解构赋值

    ```js
    # 数组参数解构
    const sum = ([x, y]) => x + y
    sum([1, 2])    // 3
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
    <input type="text" ref={ input => this.input = input }>

    // DOM 元素上使用 ref
    // input 自动获取焦点
    class AutoFocusTextInput extends React.Component {
        componentDidMount() { this.textInput.focus() }
        render() {
            return (
                <div><input type="text" ref={input => this.textInput= input} /></div>
            )
        }
    }
    // 组件上使用 ref（此时 ref 的回调函数接收的参数是组件的实例）
    // 在组件外部操作组件（父组件操作子组件）

    // 父组件访问子组件的 DOM 节点
    // 子组件 DOM 元素定义 ref，值是父组件传过来的回调函数
    function Children(props) {
        return <div><input ref={props.inputRef} /></div>
    }
    class Parent extends React.Component {
        render() {
            return <Children inputRef={el => this.inputElement = el} />
        }
    }
    ```

    - 只能为类组件定义 `ref` 属性，不能为函数组件定义 `ref` 属性
        - 函数组件内部可以使用 `ref` 来引用其它 DOM 元素或组件

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
- Portals 特性可以把组件渲染到当前组件树以外的 DOM 节点
    - 典型应用场景是渲染应用的全局弹窗，任意组件都可以讲弹窗组件渲染到跟节点上
# 设计
## `state`
- `state` 必须代表一个组件 UI 呈现的最小状态集
    - 分两类数据
        1. 渲染组件的数据源
        2. 组件 UI 展现形式的判断依据
- 组件的**普通属性**：除 `state`，`props` 外的组件属性
    - `state`，`props` 是 React 在 Component class 中预定好的组件属性
    - 普通属性（如 timer）不要放在 `state` 中，放在构造器中（`this.timer = null`）
        - 与组件的渲染无关的属性要定义为组件的普通属性，直接挂载到 `this` 下，而不是作为组件的 `state`
        - 判断依据是组件 `render` 有没有用到该变量
- 变量是否作为 `state` 判据
    1. 是否通过 `props` 从父组件获取
    2. 是否在组件的整个生命周期中都保持不变
    3. 是否可以通过其他 `state` 或 `props` **计算**得到
    4. 是否在组件的 `render` 方法中使用
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
        counter: preState.quantity + 1
    }));
    // preState 是当前最新状态（本次组件状态修改后生效的状态）的前一个状态，即本次组件修改前的状态
    // props 是当前最新的 props
    ```

    - [ ] 何时会合并
    - [ ] ***如何强制更新***
- 不要依赖当前的 `state` 计算下一个 `state`，依赖的 `this.state` 不能保证是最新
- 同样不能依赖当前 `props` 计算下一个状态，`props` 的更新也是异步的
- `state` 是**合并**的过程，只需传入发生改变的字段
    - [ ] 字段值是对象的情况
### 不可变对象
- `state` 设计成**不可变对象**，`shouldComponentUpdate` **只需比较两次状态**的引用就可以判断状态是否发生改变
    - 数组
        - `concat`, `slice`, `filter`, ES6 spread syntax 会返回新数组
        > - `push`, `pop`, `shift`, `unshift`, `splice` 会修改原数组
    - 对象
        - `Object.assign`, object spread properties
# HOC
- 接收组件作为参数并返回组件的函数
- 使用场景
    1. 操纵 `props`
        - 在被包装组件接收 `props` 之前，hoc 先拦截到 `props` 并进行处理，再讲处理后的 `props` 传递给被包装组件

        ```jsx
        const withPersistentData = (WrappedComponent, key) => {
            return class extends Component {
                componentWillMount() {
                    const data = localStorage.getItem(key)
                    this.setState({data})
                }
                render() {
                    {/* 把 hoc 拦截到的属性传递给被包裹组件 */}
                    return <WrappedComponent data={this.state.data} {...this.props} />
                }
            }
        }
        class MyComponent extends Component {
            render() {
                return <div>{this.props.data}</data>
            }
        }
        const MyComponentWithPersistentData = withPersistentData(MyComponent, 'data')
        ```

    2. 通过 `ref` 访问组件实例
        - 高阶组件通过 `ref` 获取被包装组件实例的引用后，具备直接操作被包裹组件的属性、方法的能力

        ```jsx
        const withRef = WrappedComponent => {
            return class extends React.Component {
                constructor(props) {
                    super(props)
                }
                someMethod () => {
                    this.wrappedInstance.someMethodInWrappedComponent()
                }
                render() {
                    return <WrappedComponent ref={ instance => { this.wrappedInstance = instance }} {...this.prop } />
                }
            }
        }
        ```

        - `WrappedComponent` 被渲染时，执行 `ref` 回调函数，高阶组件通过 `this.wrappedInstance` 保存 `WrappedComponent` 实例的引用，在 `someMethod` 中通过 `this.wrappedInstance` 调用 `WrappedComponent` 中的方法
        - 适用于高阶组件封装的复用逻辑需要被包装组件的方法或属性的协同支持的情况
    3. 组件的状态提升
        - 通过将被包装组件的状态及相应的状态处理方法提升到高阶组件自身内部，实现被包装组件的无状态化

        ```jsx
        const withControlledState = WrappedComponent {
            return class extends React.Component {
                constructor(props) {
                    super(props)
                    this.state = { value: '' }
                }
                handleValueChange = e => { this.setState({value: e.target.value})}
                render() {
                    const newProps = {
                        controlledProps: {
                            value: this.state.value
                            onChange: this.handleValueChange
                        }
                    }
                    return <WrappedComponent {...this.props} {...newProps} />
                }
            }
        }
        class SimpleControlledComponent extends React.Component {
            render() {
                return <input name="simple" {...this.props.controlledProps} />
            }
        }
        const ComponentWithControlledState = withControlledState(SimpleControlledComponent)
        ```

    4. 用其它元素包装组件
        - 在高阶组件渲染 `WrappedComponent` 是添加额外的元素，常用于为 `WrappedComponent` 增加布局或修改样式

        ```jsx
        function withRedBackground(WrappedComponent) {
            return class extends React.Componenet {
                render() {
                    return (
                        <div style={{backgroundColor: 'red'}}
                            <WrappedComponent {...this.props} />
                        </div>
                    )
                }
            }
        }
        ```

## 参数传递
- `HOC(...params)(WrappedComponent)`

    ```jsx
    const withPersistentData = key => WrappedComponent => {...}
    const MyComponentWithPersistentData = withPersistentData('data')(MyComponent)

    const ConnectedComponentA = connect(mapStateToProps, mapDispatchToProps)(ComponentA)

    /* 拆分 */
    // connect 和 enhance 都是函数
    const enhance = connect(mapStateToProps, mapDispatchToProps)
    // enhance 也是一个高阶组件
    const ConnectedComponentA = enhance(ComponentA)
    ```

- `f(g(h(WrappedComponent)))`
    - 最内层的高阶组件 `h` 可以有**多个参数**，但其它高阶组件只能接收一个参数，这样才能保证内层的函数返回值匹配外层函数的参数数量（1 个）

    ```jsx
    // withLog() 的执行结果是高阶组件；connect(mapStateToProps) 执行结果是一个高阶组件
    const ConnectedComponentA = connect(mapStateToProps)(withLog()(ComponentA))
    ```

- 工具函数 `compose(...funcs)`

    ```jsx
    function compose(...funcs) {
        // 原样返回传入的组件，不增强
        if (funcs.length === 0) { return arg => arg }
        if (funcs.length === 1) { return funcs[0] }
        return funcs.reduce((a, b) => (...args) => a(b(args)))
    }

    const enhance0 = compose()
    const hocCA0 = enhance0(MyComponentA)    // 未增强组件
    const enhance1 = compose(connect(mapStateToProps))
    const hocCA1 = enhance1(MyComponentA) = connect(mapStateToProps)(MyComponentA)
    const enhance2 = compose(connect(mapStateToProps), withLog())
    const hocCA2 = enhance2(MyComponentA)

    compose(a, b, c)
    /* reduce */
    ((...args) => a(b(args)), c).reduce((a, b) => (...args) => a(b(args)))    
    // c(args) becomes the first functions's args
    (...args) => a(b(c(args))) ==> c(args) => a(b(c(args))) ===> compose(a, b, c): (...args) => a(b(c(args)))
    ```

    - `compose` 把高阶组件的嵌套写法打平
    - `compose(f, g, h)` 等价于 `(...args) => f(g(h(args)))`
- 属性代理：高阶组件处理通用逻辑，再将相关属性传递给被包装组件
- 继承方式实现 hoc
    - 通过继承被包装组件实现逻辑复用
    - 常用语渲染劫持

    ```jsx
    function withAuth(WrappedComponent) {
        return class extends WrappedComponent {
            render() {
                // 调用 WrappedComponent 的 render 方法渲染组件
                if (this.props.loggedIn) { return super.render() }
                else { return null }
            }
        }
    }
    ```

    - 继承方式实现的 hoc 对被包装组件有侵入性，当组合多个 hoc 使用时很容易因子类组件忘记通过 `super` 调用父类组件方法二导致逻辑丢失
## 注意事项
1. 为在开发调试阶段更好地区分包装了不同组件的高阶组件，需要对高阶组件的现实名称作自定义处理
    
    ```jsx
    function withPersistentData(WrappedComponent) {
        return class extends Component {
            static displayName = `HOC(${getDisplayName(WrappedComponent)})`
        }
        render() { ... }
    }
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component'
    }
    ```

2. 不要在组件的 `render()` 方法中使用 hoc，尽量不要在组件的其他生命周期方法中使用 hoc
    - 