# 开发环境
- create-react-app 
    - `npm install -global create-react-app`
    - `create-react-app first_react_app`
    - 在项目目录下运行 `npm start`
        - `start` 命令实际调用了 `react-scirpts` 命令，它是 `create-react-app` 添加的一个 npm 包
- `eject` 命令把隐藏在的 `react-scripts` 中的一系列技术站配置弹射到应用顶层，方便研究配置细节
    - `npm run eject`
    - 新增两个目录 scripts 和 config
    - `start` 命令将使用 scripts 目录下的 start.js
    - config 目录下的 webpack.config.dev.js 定制的就是 `npm start` 所做的构造过程
    - `eject` 操作不可逆
- 可在 package.json 加上 git 仓库信息
- Babel 将未得到浏览器支持的新特性转为 ES5 代码
    - Babel 会将 `import` 转为 `require`，浏览器不能直接使用 `require`
    - webpack 让浏览器支持 CommonJS 的代码书写与打包
- CSS 预处理器为 CSS 增加一些编程特性
- 前端开发中，主要是配合静态测试框架来做单元测试
    - karma
- webpack 把有依赖关系的各种文件打包成一系列静态资源
    - 业界通用的方案是直接利用 `npm scripts` 来定义项目内置脚本
    - `webpack-dev-server` 是基于 Express 的小型文件服务器，最基本的功能是启动 HTTP 服务器来支持通过 HTTP 协议访问应用；和 webpack 结合可以提供强大的热模块替换功能
- `babel-eslint` 让 ESLint 用 Babel 作为解释器，`eslint-plugin-react` 让 ESLint 支持 React 语法
- EditorConfig 的目的是让工程里的代码像是在同一个编辑器打开的
- > [react boilerplate](https://github.com/react-boilerplate/react-boilerplate)
# About React
- React 提供 View 层解决方案
- React 是一个包含 View 和 Controller 的库
- 开发者只需关注要显示什么，而不用操心怎样去做
    - 关心 UI 该变成什么样子，而不是关心如何改变 UI 的样子    
    - 关注渲染成什么样子，而不用关心如何实现增量渲染
- `UI = render(data)`
    - 纯函数，无副作用，输出完全取决于输入，输入相同则输出必相同
    - 只接受数据作为参数
    - 开发者只需区分哪些属于 data，哪些属于 render
    - 要想更新界面，只需更新 data，用户界面自然做出响应（react）
    - React 强制所有组件都按照这种数据驱动渲染的模式来工作
- React 精髓是函数式编程
- React 通过创建于更新虚拟元素来管理 virtual DOM
    - 虚拟元素的更新和构建都在内存中完成
    - 虚拟元素是真实元素的对应
- React 利用 virtual DOM，每次渲染只重新渲染最少的 DOM 元素
    - React 只做必要更新
    - 虚拟 DOM 存在于 JS 空间，每次渲染 React 组件时，会对比上一次的虚拟 DOM
- ReactDOM 使用 camelCase 的属性命名规范
    - React 事件用 camelCase 命名
- It is conventional in React apps to use `on*` names for the attributes and `handle*` for the handler methods.
# JSX
- React 把真实的 DOM 转换成 JavaScript 对象树，即 virtual DOM
    - JS 可以将 HTML 元素表示成 JSON 对象

        ```jsx
        <button class="btn btn-blue">
            <em>Confirm</em>
        </button>

        // JSON
        {
            type: 'button',
            props: {
                className: 'btn btn-blue',
                children: [{
                    type: 'em',
                    props: {
                        children: 'Confirm'
                    }
                }]
            }
        }
        ```

    - 将 JSON 对象封装一下可以方便地得到该 HTML 元素的公共构建方法

        ```js
        const Button = ({ color, text }) => {
            return {
                type: 'button',
                props: {
                    className: `btn btn-${color}`,
                    children: {
                        type: 'em',
                        props: {
                            children: text
                        }
                    }
                }
            };
        }
        ```

    - 构建 HTML 元素的方法本身也可以作为元素，即***组件元素***

        ```
        {
            type: Button,
            // 传给 Button 方法的参数
            props: {
                color: 'blue'
                children: 'Confirm'
            }
        }
        ```

    - 组件元素嵌套、混合，即 React 组件，最终可以用递归渲染的方式构建出 DOM 树

        ```jsx
        const DangerButton = ({ text } => ({
            type: Button,
            props: {
                color: 'red',
                children: text
            }
        });

        const DeleteButton = () => ({
            type: 'div',
            props: {
                children: [{
                    type: 'p',
                    props: {
                        children: 'abc'
                    }
                }, {
                    type: DangerButton,
                    props: {
                        children: 'Confirm',
                    }
                }, {
                    type: Button,
                    props: {
                        color: 'blue',
                        children: 'Cancel'
                    }
                }]
            }
        });

        const DeleteAccount = () => (
            <div>
                <p>abc</p>
                <DangerButton>Confirm</DangerButton>
                <Button color='blue'>Cancel</Button>
            </div>
        );
        ```

    - 多层嵌套时用以上方法描述，会很复杂，JSX 通过允许在 JS 中写 HTML 解决这一问题
        - JSX 在打包阶段编译成纯 JS

        ```js
        var DeleteAccount = function DeleteAccount() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    'abc'
                ),
                React.createElement(
                    DangerButton,
                    null,
                    'Confirm'
                ),
                React.createElement(
                    Button,
                    { color: 'blue' },
                    'Cancel'
                )
            );
        };
        ```

- JSX 中的元素可以是 HTML 元素和 React 组件
    - 首字母大写的是组件
    - 组件的使用方法和 HTML 元素一样
- HTML，CSS，JS 分离实际上是把不同技术分开管理，而不是逻辑上的分而治之
- JSX 的由来
    - React 拥抱渲染逻辑与 UI 逻辑内在耦合的现实，于是没有认为将标记语言和逻辑分成单独文件，而是用称为同时包含标记语句和逻辑的称为组件的弱耦合单元来 separate concerns
    - > [说服你用 JSX](https://www.youtube.com/watch?v=x7cQ3mrcKaY)
- React 天生高内聚
- React 把 HTML 和 JS 混写，起到把实现一个功能的所有代码集中在一个文件的作用
    - 遇到 HTML 标签（以 `<` 开头），就用 HTML 规则解析
    - 遇到代码块（以 `{` 开头），就用 JavaScript 规则解析，可以用 `{}` 嵌入任何 JS 表达式
- 在 HTML 中直接添加事件处理器的缺点
    1. 事件处理器的函数在全局环境执行，污染全局变量
    2. 添加的事件处理器过多会影响网页性能
    3. 移除的 DOM 元素，若忘记一并注销事件处理器，会造成内存泄漏
- JSX 中不存在以上问题
    1. 挂载的事件处理函数都在组件的范围内，不会污染全局变量
    2. 实际使用事件委托的方式处理相同的事件，如多个点击事件最终只在 DOM 树上添加一个事件处理函数，挂在最顶层的节点上，捕获后根据具体组件分配特定函数
    3. 生命周期的 `unmount` 阶段会自动清理相关的事件处理函数，不不会造成内存泄漏
- **多行的 JSX 用括号括起来，避免意外的 `;` 插入引入问题**
- JSX 标签一定要闭合
- JSX 最外层只能有一个标签
- JSX 首字母小写的是 DOM 元素，大写的是组件元素
- JSX 在一个组件的子元素位置使用注释要用 `{}` 包起来
- Babel 将 JSX 编译为对 `React.creatElement()` 方法的调用，本质上最终生成一个 JS 对象

    ```jsx
    // JSX
    const element = (
        <h1 className="greeting">
            Hello, world!
        </h1>
    );
    // Babel 编译后
    const element = React.createElement(
        'h1',
        {className: 'greeting'},
        'Hello, world!'
    );
    // 最终结果
    const element = {
        type: 'h1',
        props: {
            className: 'greeting',
            children: 'Hello, world!'
        }
    };
    ```

    - 生成的 JS 对象称为 ***React 元素***（用户看到的内容的描述），React DOM 读取 React 对象来构建、更新 DOM
    - React 组件由 React 元素组成
- 传入 `ReactDOM.render()` 要渲染的 React 元素和 DOM 根节点完成渲染
- 纯 React 应用通常只有一个 DOM 的根节点，根节点里的内容均由 React DOM 管理
    - 只是整合进 React 的现有应用可以有多个 DOM 根节点
- React 元素不可更改，创建之后便不可改变它的子元素或属性值
    - 像是电影的一帧，表示某一个事件点上的 UI
    - 要更新 UI 的可以创建一个新元素然后传给 `ReactDOM.render()`
    - 实际应用中，大部分 React app 只会调用 `ReactDOM.render()` 一次
- ReactDOM 默认在渲染之前将嵌入 JSX 的值转义，渲染之前一切都转成了字符串，有助于防止 XSS
    - 用户输入放在 JSX 里更安全
    - `dangerouslySetInnerHTML`
    - > 实体字符相关 p11
- JSX 不是 React 的强制选项，JSX 适用于任何一套框架
# 组件
- 父组件插入子组件，子组件上的属性，在子组件的定义里通过 `props` 访问得到
- React 组件上的事件名称（如 `onClick()`）是给 HTML 元素传方法用的，本身不响应事件
- 组件接收任意输入（`props`），返回 React 元素
- React 组件分两种数据
    1. `prop`：组件的对外接口，`prop` 是外部传递给组件的数据，在外部使用组件时被赋值
    2. `state` 对象：组件的内部状态
- 组件可以将自身的状态以 `props` 的形式传给子组件
    - 即单向数据流，只能自顶向下传递数据
- 子组件调用 `props` 里的方法，传入自身的参数，父组件根据函数的逻辑决定是否更新自身 
- React 组件可以接收参数，也可能有自身状态，一旦接收到的参数或自身状态有所改变， React 组件就会执行相应的生命周期方法，最后渲染
- 组件的最终目的是输出虚拟元素
- 可以在 React 组件中定义样式
- 用类定义的组件里，事件处理器通常是类的一个方法
- 无状态组件只传入 `props` 和 `context` 两个参数，不存在 `state`，没有生命周期方法，组件本身即 `render()` 方法
    - `propTypes` 和 `defaultProps` 可以通过向方法设置静态属性来实现
    - 创建时始终保持了一个实例，避免了不必要的检查和内存分配，做到了内部优化
- 组件之间相互隔离（包括同类组件之间）
- 只包含一个 `render()` 方法的组件可以用函数式组件的写法定义
## `props`
- `this.props` is set up by React itself
- 组件类似于 JS 函数，接受输入（`props`），返回 React 元素

    ```jsx
    // functional component
    function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
    }
    // es6 class way of defining components
    class Welcome extends React.Component {
        render() {
            return <h1>Hello, {this.props.name}</h1>;
        }
    }

    const element = <Welcome name="Sara" />;
    ReactDOM.render(
        element,
        document.getElementById('root')
    );
    ```

- React 读到用户自定义组件后，会将 JSX 属性通过一个 `props` 对象传给这个组件
- React 组件不应修改 `props`
    - 对于它自身的 `props` 来说，React 组件必须表现成纯函数（不修改它的输入）
        - 父组件可能吧 `props` 传入多个子组件，若子组件去修改 `props`，结果不可预料
        - React 无法阻止开发者去修改传入的 `props` 对象，但应当做一个规范
- `prop` 支持任意 JS 数据类型
    - HTML 组件的属性值只能是字符串类型
    - `prop` 类型不是字符串时，必须用 `{}` 包住
    - **两层花括号**，外层表示 JSX 语法，内层表示对象常量
- `prop` 的类型可以是纯函数，也可以是普通函数
    - 若是普通函数，则该组件可以通过 `props` 向子组件传数据，而子组件也可以调用它并传入必要参数，把子组件的信息向外传递
- 可以通过定义组件类的 `propTypes` 属性来声明接口规范
    1. 支持哪些 `prop`
    2. `prop` 的类型
    - `isRequired`
    - 只应在开发代码中定义 `propTypes`
        - `propTypes` 检查耗费计算资源
        - 生成的错误信息对用户而言没有意义
### `constructor`
- 用类的写法定义的组件一定要用 `props` 参数调用 base constructor（`super(props)`）
- 若一个组件要定义自己的构造函数，构造函数的第一行要通过 `super` 调用父类（`React.Component`）的构造函数
    - 若构造函数中没有调用 `super(props)`，组件实例无法通过 `this.props` 访问到父组件传过来的 `props` 值
    - 组件的构造函数通过 `props` 对象 获得传入的 `prop` 值
- ES6 方法创建的 React 组件不会自动绑定 `this` 到当前的实例对象（谁调用就绑定到谁），要在 `constructor` 里手动绑定
    - `render` 是 ReactDOM 调用的，不是组件调用的，所以 `this` 的绑定会不对吧
    - constructor 里用 `bind()`（推荐）
    - 用 public class field syxtax
    - 用箭头函数（可能存在性能问题）
    - > [Understanding JavaScript Bind ()](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)
## `state`
- `state` 是组件私有，完全由组件控制
    - 只有用类定义的组件有 local state
- 父组件或子组件都无法知道某个组件是否包含状态，也不应去管该组件使用函数还是类定义的
- 所以状态是本地的、封装的，只有拥有该状态的组件能访问得到
- A component may choose to pass its state down as props to its child components
- 当组件内部使用库内置的 `setState()` 方法时，React 会去调用 `render()` 方法，尝试重新渲染组件
- React 会将传入 `setState()` 方法的对象**合并**成当前 state

    ```js
    constructor(props) {
        super(props);
        this.state = {
            post: [],
            comment: []
        };
    }
    componentDidMount() {
        fetchPosts.then(response => {
            this.setState({
                posts: response.posts
            });
        };
        fetchComments().then(response => {
            this.setState({
                comments: response.comments
            });
        });
    }
    ```

    - 用的是 shallow merge，调用 `this.setState({comments})` 不影响 `this.state.posts`，只是替换掉 `this.state.comments`
- `setState()` 是异步方法，出于性能考虑，React 会将一个生命周期内的所有 `setState()` 方法会合并操作
    - 所以状态（`this.state` 和 `this.props`）更新可能是**异步**的
    - 不能依赖本次状态的值去计算下一次的状态

        ```JS
        // 错误
        this.setState({
            counter: this.state.counter + this.props.increment
        });

        // 正确
        this.setState((prevState, props) => ({
            counter: prevState.counter + props.increment
        }));
        ```

- 必须使用 `setState()` 修改 `state`
    - 直接修改 `state` 不会触发页面的刷新
    - 只在构造器里才去直接操作 `this.state`，其它地方一律用 `setState()`
    - `setState()` 可以接受一个对象作为参数
    - 另一种形式的 `setState()` 接受一个函数作为参数（如上”正确“的例子）
- 可以用组件的 `defaultProps` 属性设置 `state` 的默认值
## `state` 和 `prop` 的局限
- 子组件有自己的状态来计数，父组件也有状态来统计所有子组件的计数总和，数据出现重复，带来重复数据的一致性问题
- 若包含三级以上组件结构，顶层组件需要给底层组件传递数据，用 `prop` 方法只能通过中间组件中转，若中间组件本身不需要 `prop` 属性，但是为了搬运只好支持 `prop`，违反低耦合原则
- 把数据源放在在 React 组件之外形成全局状态是一种思路，让各个组件保持和全局状态一致
    - 此为 Flux 和 Redux 中 Store 的概念
# 生命周期钩子
- 3 
    1. mounting（装载）：把组建第一次在 DOM 中渲染
    2. updating：组件被重新渲染
    3. unmounting（卸载）：组件从 DOM 中删除
- 生命周期函数又称为生命周期钩子
## 装载
- 依次调用以下函数
    - `constructor()`
        - 初始化 `state`
        - 绑定成员函数的 `this` （`this.foo = ::this.foo;`）
        - 无状态的 React 组件不需要定义构造函数
    - `getInitialState()` 和 `getDefaultProps()`
        - 只有用 `React.createClass()` 方法创建的组件才会调用

            ```js
            const Sample = React.createClass({
                getInitialState: function() {
                    return { foo: 'bar' };
                },
                getDefaultProps: function() {
                    return { sampleProp: 0 }
                }
            });

            // ES6

            class Sample extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { foo: 'bar' };
                };
                Sample.defaultProps = {
                    return { sampleProp: 0 };
                }
            }
            ```

        - `getInitailState()` 方法在整个组件的生命周期只被调用一次
        - `React.createClass()` 方法已被弃用
    - `render()`
        - 一个 React 一定要实现 `render()` 方法
            - `React.Component` 类对除了 `render()` 以外的所有生命周期方法都有默认实现
        - `render()` 不做实际的渲染动作，值返回一个 JSX 描述结构，最终由 React 来操作渲染过程
        - 对于无需渲染界面的特殊组件，让 `render()` 函数返回 `null` 或 `false`
        - `render()` 要是一个纯函数，完全根据 `this.state` 和 `this.props` 来决定返回结果，不产生任何副作用
            - `render()` 不应去调用 `this.setState()`
    - `componentWillMount()` 和 `componentDidMount()`
        - `componentWillMount()` 会在调用 `render()` 前被调用，`componentDidMount()` 会在调用 `render()` 后被调用
        - 一般不定义 `componentWillMount()` 函数，所有可以在 `componentWillMount()` 实现的都可以提前到 `constructor()` 里去做
        - `componentDidMount()` 被调用时，`render()` 函数返回的内容已经引发渲染，组件已被装载到 DOM 树上
            - 对多个组件的情况，React 必须把各个组件返回的结果综合起来才去渲染 DOM，所以要等各个组件的 `render()` 执行完毕，才依次调用各个组件的 `componentDidMount` 作为装载过程的收尾
        - `componentDidMount()` 只能在浏览器端调用，`componentWillMount()` 则也可以在服务器端调用
        - `componentDidMount()` 被调用时，组件已被装载到 DOM 树上，可以放心获取渲染出来的 DOM 元素
- 组件被装载在 DOM 上后，用户可以在浏览器看到组件的第一印象
## 更新
- `props` 或 `state` 被修改时会触发组件的更新
- 依次调用以下函数
    - `componentWillReceiveProps(nextProps)`
        - 只要父组件的 `render()` 被调用，在该 `render()` 函数里被渲染的子组件就会经历更新过程，无论父组件传给子组件的 `props` 有没有改变都会触发子组件的 `componentWillReceiveProps()` 
        - `componentWillReceiveProps()` 根据新的 `props` 值来计算是否要调用 `this.setState()` 来更新内部 `state`
            - 所以 `this.setState()` 方法触发的更新不会调用 `componentWillReceiveProps()`，否则就死循环了
        - React 组件组合中，完全可以只渲染一个子组件而不渲染其它组件，这样有助于提升性能
    - `shouldComponentUpdate(nextProps, nextState)`
        - 决定一个组件什么时候不需要渲染
        - 和 `render()` 组成 React 生命周期函数里唯二要返回值的函数
        - 返回一个布尔值，指示这个库在此次更新过程中是否要继续下去
        - `React.Component` 对此方法的默认实现是返回 `true`

            ```js
            // 自定义实现
        
            shouldComponentUpdate(nextProps, nextState) {
                return (nextProps.caption !== this.props.caption) || (nextProps.count !== this.state.count);
            }
            ```

                - `this.setState()` 引发的更新过程并不会立即更新组件的 `state` 值，执行到 `shouldComponentUpdatve()` 时 `state` 值仍是 `this.setState()` 执行之前的值，所以可以用以上代码来比较
    - `componentWillUpdate()`，`render()`，`componentDidUpdate()`
        - 无论更新过程发生在服务器端还是浏览器端，`componentDidUpdate()` 都会被调用
## 卸载
- `componentWillUnmount()` 
    - 组件从 DOM 上删除之前被调用
    - 适合做清理工作
## Ticking clock demo

    ```jsx
    function tick() {
        const element = (
            <div>
                <h1>hello, world</h1>
                <h2>It is {new Date().toLocaleTimeString()}.</h2>
            </div>
        );
        ReactDOM.render(
            element,
            document.getElementById('root')
        );
    }
    setInterval(tick, 1000);

    // 封装 Clock
    function Clock(props) {
        return {
            <div>
                <h1>hello, world</h1>
                <h2>It is {props.date.toLocaleTimeString()}.</h2>
            </div>
        };
    }
    function tick() {
        ReactDOM.render(
            <Clock date={new Date()} />,
            document.getElementById('root')
        );
    }

    //  将函数转为类
    class Clock extends React.Component {
        render() {
            return (
                <div>
                    <h1>hello, world</h1>
                    <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
                </div>
            );
        }
    }

    // 加入 lcoal state
    class Clock extends React.Component {
        constructor(props) {
            super(props);
            this.state = {data: new Date()};
        }
        componentDidMount() {
            this.timerID = setInterval(
                () => this.tick(), 1000
            );
        }
        componentWillUnmout() {
            clearInterval(this.timeID);
        }
        tick() {
            this.setState({
                date: new Date()
            });
        }
        render() {
            return (
                <div>
                    <h1>hello, world</h1>
                    <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
                </div>                
            );
        }
    }
    ReactDOM.render(
        <Clock />,
        docuemnt.getElementById('root')
    );
    ```

    - 渲染步骤
        - `ReactDOM.render()` 传入 `<Clock />` 后， React 调用组件构造器，用一个对象初始化 `this.state`
        - React 调用组件 `render()` 更新 DOM 使之与组件的输出匹配
        - `Clock` 的输出插入 DOM 后，React 调用 `componentDidMount()` 钩子，设置调用组件 `tick()` 方法的定时器
        - 浏览器每秒调用一次 `tick()`，`tick()` 方法里，传入一个对象调用 `setState()` 方法，React 检测到 state 发生变化，随即再次调用组件的 `render()` 方法
        - `Clock` 组件从 DOM 中移除后，React 调用 `componentWillUnmount()` 钩子移除计时器
# Writing React
- React 必须显式调用 `preventDefault()` 方法来阻止事件触发后浏览器的默认行为
    - HTML 中可以用 `return false`
- 组件元素的属性完全自定义，是构建组件所需要的参数
    - HTML 元素的自定义属性要加 `data-` 前缀；自定义元素中任意属性都被支持
    - 属性值要用表达式时，用 `{}` 替换 `""`
    - 子组件也可作为表达式使用

    ```jsx
    // 输入 （JSX）
    const content = <Container>{window.isLoggedIn ? <Nav /> : <Login />}</Container>;

    // 输出 （JS）
    const content = React.createElement(
        Container,
        null,
        window.isLoggedIn ? React.createElement(Nav) : React.createElement(Login)
    );
    ```

- 展开属性

    ```jsx
    const data = { name: 'foo', value: 'bar' };
    const component  = <Component name={data.name} value={data.value} />;
    // rest/spread
    const component = <Component {...data} />;
    ```

- Immutability 优点
    - undo/redo，time travel
    - 确定一个对象是否更改要遍历整个对象树，确定不变对象是否更改只需要比较前后的引用
    - 有助于 pure components 确定何时需要重新渲染
## 事件
- 给事件处理器传参

    ```jsx
    <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
    <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
    ```

    - `e` 表示 React 事件，`bind` 的写法会默认传递过去
    
## 渲染
- React 元素是纯对象，DOM 元素不是
    - JSX 最终被解析为纯对象
- React DOM 负责更新 DOM，使之与 React 元素（组件的 `render()` 函数的 output) 匹配
- To render a React element into a root DOM node, pass both to `ReactDOM.render()`
- 条件渲染

    ```jsx
    function Greetging(props) {
        const isLoggedIn = props.isLoggedIn;
        if (isLoggedIn) {
            return <UserGreeting />;
        }
        return <GuestGreeting />;
    }
    class LoginControl extends React.Component {
        constructor(props) {
            super(props);
            this.handleLoginClick = this.handleLoginClick.bind(this);
            this.handleLogoutClick = this.handleLogoutClick.bind(this);
            this.state = {isLoggedIn: false};
        }
        handleLoginClick() {
            this.setState({isLoggedIn: true});
        }
        handleLoginoutClick() {
            this.setState({isLoggedIn: false});
        }
        render() {
            const inLoggedIn = this.state.isLoggedIn;
            const button = isLoggedIn ? (<LogoutButton onClick={this.handleLogoutClick} />) : (<LoginButton onclick={this.handleLoginClick} />);
            return (
                <div>
                    <Greeting isLoggedIn={isLoggedIn} />
                    {button}
                </div>
            );
        }
    }
    ReactDOM.render(
        <LoginControl />,
        document.getElementById('root')
    );
    ```

- 元素内的条件渲染（inline if）

    ```jsx
    function Mailbos(props) {
        const unreadMessages = props.unreadMessages;
        return (
            <div>
                <h1>hello</h1>
                {unreadMeassages.length > 0 &&
                <h2>You have {unreadMessages.length} unread messages.</h2>
                }
            </div>
        );
    }
    ```

- 元素内渲染（三元操作符）
- 一个组件若不想被其他组件渲染，可以返回 `null` 而不去返回原本要渲染的内容
    - 返回 `null` 不会阻止组件生命周期函数的触发

    ```jsx
    function WarningBanner(props) {
        if (!props.warn) {
            return null;
        }
        return (
            <div className="warning">
                Warning!
            </div>
        );
    }
    class Page extends React.Component {
        constructor(props) {
            super(props);
            this.handleToggleClick = this.handleToggleClick.bind(this);
            this.state = {showWarning: true};
        }
        handleToggleClick() {
            this.setState(prevState => ({
                showWarning: !prevState.showWarning
            }));
        }
        render() {
            return (
                <div>
                    <WarningBanner warn={this.state.showWarning} />
                    <button onClick={this.handleToggleClick}>
                        {this.state.showWarning ? 'Hide' : 'Show'}
                    </button>
                </div>
            );
        }
    }
    ```

## 元素的列表
- 通常会在组件里渲染多个元素

    ```jsx
    function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) => 
            <li key={number.toString()}>
                {number}
            </li>
        );
        return (
            <ul>{listItems}</ul>
        );
    }

    const numbers = [1, 2, 3, 4, 5];
    ReactDOM.render(
        <NumberList numbers={numbers} />,
        document.getElementById('root');
    );
    ```

    - 列表元素要有 `key` 属性
        - `map()` 调用里的元素要有 `key`
        - `key` 的值只要兄弟元素之间不同即可，不用全局不同
        - `key` 不会传入组件，只给 React 作提示用
        - `key` 有助于 React 识别哪些列表元素被改变、增加或删除
        - 用下标作为 `key` 值会影响性能，可能造成组件状态出问题
            - 未指定 `key` 的话 React 会默认使用下标作为 `key` 
            - > [用下标作为 `key` 值的缺点](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)
- `map()` 里的元素要写 `key`
- 有时候在 JSX 里写 `map()` 更清晰

    ```jsx
    function NumberList(props) {
        const numbers = props.numbers;
        return (
            <ul>
                {numbers.map((number) =>
                <ListItem key={number.toString()} value={number} />
            )}
            </ul>
        );
    }
    ```

    - `map()` 里嵌套过多时考虑抽象组件
## 表单
- HTML 中，表单元素通常维护着自身的状态并根据用户输入来更新
- React 中，可更改的状  态保存在 `state` 中且只通过 `setState()` 来更新
- An input form element whose value is controlled by React is called a controlled component
- 受控组件
    - React 的 `state` 作为唯一授信的数据源，表单元素的值由 React 唯一确定（React 负责维护）
    - 负责渲染表单的组件同时控制用户往表单输入数据后表单的行为
    - An input form element whose value is controlled by React in this way is called a "controlled component"

    ```jsx
    class NameForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {value: ''};
            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
        handleChange(event) {
            this.setState({value: event.target.value});
        }
        handleSubmit(event) {
            alert('A name was submitted: ' + this.state.value);
            event.preventDefault();
        }
        render() {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            );
        }
    }
    ```

    - 表单元素的 `value` 值设置成 `this.state.value`，每次 `setState()` 被调用后表单值也会被更新，使得 React state 称为 single source of truth
- HTML 中 `<textarea>` 元素的文本通过它的 `children` 来定义；React 中则通过 `value` 定义，处理方法与表单元素类似
- HTML 中 `<select>` 的 `<option>` 带有 `selected` 属性表示初始时被选中的项目；React 中在 `<select>` 上加 `value` 属性来实现同样的效果
    - 传入 `value` 的值是数组时可以多选
- 需要处理多个受控 `input` 元素时，为每个元素增加一个 `name` 属性，处理器函数根据 `event.target.name` 来决定如何处理

    ```JSX
    class Reservation extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isGoing: true,
                numberOfGuests: 2
            };
            this.handleInputChange = this.handleInputChange.bind(this);
        }
        handleInputChange(event) {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            // computed property name
            this.setState({
                [name]: value
            });
        }
        render() {
            return (
                <form>
                    <label>
                        Is going:
                        <input
                            name="isGoing"
                            type="checkbox"
                            checked={this.state.isGoing}
                            onChange={this.handleInputChange} />
                    </label>
                    <br />
                    <label>
                        Number of guests:
                        <input
                            name="numberOfGuest"
                            type="number"
                            value={this.state.numberOfGuests}
                            onChange={this.handleInputChange}
                    </label>
                </form>
            );
        }
    }
    ```

- 若受控组件写死 `value` 属性的值，用户则无法改变进行输入

    ```jsx
    ReactDOM.render(<input value="hi" />, mountNode);
    setTimout(function() {
        ReactDOM.render(<input value={null} />, mountNode);
    }, 1000);
    ```

    - 1s 后输入框才解锁

- 受控组件的每一个状态变动都会有一个相关的事件处理器函数来负责
    - It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component
- Square no longer keeps its own state; it receives its value from its parent Board and informs its parent when it’s clicked. We call components like this controlled components
- > [uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html)
## 状态提升
- When you want to aggregate data from multiple children or to have two child components communicate with each other, move the state upwards so that it lives in the parent component. The parent can then pass the state back down to the children via props, so that the child components are always in sync with each other and with the parent
- 通常会有多个组件反映同一个数据的变化，惯常做法是把共享的状态提升到最近的共同祖先节点
- 温度计算器 demo

    ```jsx
    class scaleNames = {
        c: 'Celsius',
        f: 'Fahrenheit'
    };

    function toCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5 / 9;
    }

    function toFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }

    function tryConvert(temperature, convert) {
        const input = parseFloat(temperature);
        if (Numbr.isNaN(input)) {
            return '';
        }
        const output = convert(input);
        const rounded = Math.round(output * 1000) / 1000;
        return rounded.toString();
    }

    function BoilingVerdict(props) {
        if (props.celsius >= 100) {
            return <p>The water would boil.</p>;
        }
        return <p>The water would not boil.</p>
    }
    class TemperatureInput extends React.Component {
        constructor(props) {
            super(props);
            this.handleChange = this.handleChange.bind(this);
            this.state = {temperature: ''};
        }
        handleChange(e) {
            this.props.onTemperatureChange(e.target.value);
        }
        render() {
            const temperature = this.props.temperature;
            const scale = this.props.scale;
            return (
                <fieldset>
                    <legend>Enter temperature in {scaleNames[scale]}:</legend>
                    <input value={temperature} onChange={this.handleChange} />
                </fieldset>
            );
        }
    }
    class Calculator extends React.Component {
       constructor(props) {
           super(props);
           this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
           this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
           this.state = {temperature: '', scale: 'c'};
       }
       handleCelsiusChange(temperature) {
           this.setState({scale: 'c', temperature});
       }
       handleFahrenheitChange(temperature) {
           this.setState({scale: 'f', temperature});
       }
       render() {
           const scale = this.state.scale;
           const temperature = this.state.temperature;
           const = celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
           const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
           return (
               <div>
                    <TemperatureInput 
                        scale="c" 
                        temperature={celsius}
                        onTemperatureChange={this.handleCelsiusChange} />
                    <TemperatureInput 
                        scale="f" 
                        temperature={fahrenheit}
                        onTemperatureChange={this.handleFahrenheitChange} />
                    <BoilingVerdict
                        celsius={parseFloat(celsius)} />
                </div>
           );
       }
    }
    ```

    - `onChange` 还是挂在目标表单元素上，并没有提升到父元素上
    - 父元素提供事件处理函数，目标表单元素提供用户数据
    - 执行的是父元素的 `setState`，结果是子元素一并得到更新
- There should be a single “source of truth” for any data that changes in a React application
- Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the top-down data flow
## 用组合不用继承
- 有些组件无法提前知道它们的子组件，此时可用 `children` 传入子组件
- 容器（containment）

    ```JSX
    function FancyBorder(props) {
        return {
            <div className={'FancyBorder FancyBorder-' + props.color}>
                {props.children}
            </div>
        };
    }

    function WelcomeDialog() {
        return (
            <FancyBorder color="blue">
                <h1 className="Dialog-title">
                    Welcome
                </h1>
                <p className="Dialog-messages">
                    Thank you for visiting.
                </p>
            </FancyBorder>
        );
    }
    ```

    - 此写法可以让其它组件可以通过嵌套 JSX 传任意的子元素给 `FancyBorder` 组件
    - `<FancyBorder>` 里的内容都通过 `props.children` 访问
- 自定义多个类 `children` 的 prop

    ```jsx
    function SplitPane(props) {
        return (
            <div className="SplitPane">
                <div className="SplitPane-left">
                    {props.left}
                </div>
                <div className="SplitPane-right">
                    {props.right}
                </div>
            </div>
        );
    }
    function App() {
        return (
            <SplitPane
                left={<Contacts />}
                right={<Chat />}
            />
        );
    }
    ```

    - React 元素只是对象而已，所以可以当 props 传
- 组合（composition）：一个特定的组件传 `props` 给通用组件并渲染它
    - 不要用继承
- 组件可以接受任意的 props（including primitive values, React elements, or functions）
- 要在模块间重用非 UI 相关的功能，可以把它抽象成独立的 JS 模块，这样其它模块可以通过引入该模块来调用其中的功能而无需用到扩展
## Thinking in React
- 构建项目的流程
    1. 将 UI 分解成能表示一部分数据模型的组件，遵循单一职责原则；将组件划分层级
        - 理想情况一个组件只应该作一件事
    2. 用 React 构建静态版本的应用来展示数据模型
        - 构建组件，组件复用其它组件，用 `props` 传递数据
        - 通过 `props` 从父组件向子组件传数据
        - 顶层组件的 `props` 从数据模型获得
        - 不要用 `state`，它是交互时用的
        - 此时各个组件只有 `render()` 方法
        - 小项目通常自顶向下构建更容易，大项目则自底向上构建更容易
    3. 识别 UI 状态的最少完整描述
        - DRY
        - 确定 app 需要更改的 state 的最小数目
            1. 从父组件通过 `props` 传下来的大概率不是一个 state
            2. 值不会变化的，大概率不是一个 state
            3. 可以从其它 state 或 prop 计算得到的，不是 state
    4. 识别 `state` 应该存在于何处
        - 确定 state 归哪个组件所有的步骤
            - 找到要基于此状态渲染的所有组件
            - 找出一个这些组件的共有父组件
            - 共有父组件或另一个更高层级的组件应该拥有此状态
            - 若把该状态放到已有的任意组件上都显得不合理，在共有父组件之上新建一个组件来放置此状态
    5. 增加反向数据流
        - 套路：子组件上挂事件处理器响应用户事件；子组件的事件处理函数由父组件提供；子组件负责提供事件处理函数的参数；事件处理函数做的事是调用父组件的 `setState()`，父组件的子组件一并得到更新