# 套路
- `yarn add react@next` 升级组件
- chrome devtools - more tools - rendering - check paint flashing
- 本地离线存储的数据在 reducer 的 state 的默认值里读取进来
- `onSubmit` 要绑在 `<form>` 上
- update 套路（crud）
    - 服务器上的数据可能被更新过，本地 state 要以服务器数据为准
    - `mapStateToProps` 接收两个参数： `state` 和 `props`

    ```js
    const mapStateToProps = (state, props) => {
      const { match } = props;
      if (match.params._id) {
        return {
          game: state.games.find(item => item._id === match.params._id)
        }
      }
      return { game: null };
    }
    ```

- 返回并列的多个组件
    - react 自带的 `Fragment` 可以把并列的元素包起来，这样就不需要用到 `<div>` 以至于引入多余的 `<div>`
    - 用 `[]` 包起来，给每个组件加个 `key` 属性
    - 高阶组件（hoc/Cps.js）
- 多个表单只须一个 `onChange()`

    ```js
    onChange = e => { 
      this.setState({[e.target.name]: e.target.value})
    }
    ```

- N 个 `input` 框决定按钮是否 `disabled` 的套路

    ```jsx
    // account-app/RecordForm
    valid() {
      return this.state.date && this.state.title && this.state.amount;
    }

    <button disabled={!this.valid()}></button>
    ```

    - 这里没绑 `this`
    - 事件处理函数都有绑 `this`
    - 普通成员函数都不用绑 `this`，`this` 指向方法所在的组件
- `fetch`（crud/.../actions/index.js）

    ```js
    fetch("https://5af71a21c222a90014dbda4f.mockapi.io/api/v1/records").then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
    });
    ```

- 逗号表达式

    ```JS
    this.setState((
      obj = {},
      obj["" + name] = e.target.value,
      obj
    ));
    ```

- 用户端输入非空检查（验证）；一旦输入非空红色警告样式就消失；用户输入不符合要求时不允许提交；点击提交后提示正在提交的状态（crud/.../GameForm.js）
    - 前端验证不可靠，把 js 禁掉就可以跳过验证
    - 前端验证只是为了让用户体验更好
    - **后端验证**才可靠（crud/server.js）
- 异步 action 发送异步动作（如请求服务器数据；延时动作），执行成功后再（返回 promise 的话在 `.then()` 里） dispatch 一个 action，里面包含了前面异步操作的返回的数据，交由 reducer 来处理该数据

    ```js
    const get_user = () => {
    return dispatch => {
        // 请求之前将标示请求状态的变量设为 true
        dispatch(fetching_user());
        axios.get('https://randomuser.me/api/')
        .then(res => {
            dispatch(fetch_user_ok(res.data.results[0]));
        })
        .catch(error => {
            dispatch(fetch_user_failed(error.response.data));
        })
    };
    }
    ```

- `classnames` 包

    ```jsx
    // !!this.state.errors.title 为真，就加上名为 error 的 class
    <div className={ classnames('field', { error: !!this.state.errors.title })}>
    ```

- action 若要返回一个函数（异步动作），必须用中间件（如 `redux-thunk`）处理
- `redux-devtools-extension` 包

    ```js
    import { composeWithDevTools } from 'redux-devtools-extension';    

    const store = createStore(
      rootReducer,
      composeWithDevTools(
        applyMiddleware(logger)
      )
    );
    ```

- `nodemon` 包
    - 文件服务器的（JS）代码改变后自动重启
    - package.json

        ```js
        "scripts": {
          ...,
          "start": "nodemon --exec babel-node -- ./server.js"
        }
        ```

- 后端用 ES6 写 nodejs 要装 babel 
    - `npm install --save-dev babel-cli babel-preset-env`

        ```js
        // .babelrc
        {
            "presets": ["env"]
        }

        // package.json
        "start": "nodemon --exec babel-node -- ./server.js"        
        ```

- nodejs 后端要用 `body-parser` 包解析前端的请求数据
- 前后端分离的项目，要在前端 package.json 里**配置代理**
    - `"proxy": "http://localhost:8080"`
- `configureStore`（hello-redux）
    - 开发环境保留着，生产环境屏蔽掉

        ```
        # .env
        REACT_APP_DECORATORS=true

        # configureStore.js
        if (process.env.NODE_ENV === 'production') {
          module.exports = require('./configureStore.prod');
        } else {
          module.exports = require('./configureStore.dev');
        }
        ```

- `create-react-app` 可以设置环境变量
    - 配置环境变量后要重启服务
- **模拟 API 数据**
    - [mock api](https://www.mockapi.io)   
        - `curl http(s)://5af71a21c222a90014dbda4f.mockapi.io/api/v1/{ field }`
        - 用 Postman 的 UI 操作
            - 用 `POST` 方法时选 Body - raw 
    - `json-server` 包
        - Postman：用 `POST` 方法时选 Body - `x-www-form-urlencoded`
- 生成随机用户 API
    - `https://randomuser.me/`
- 部署 React 前端应用
    - Netlify
        - `netlifyctl`
            - 部署时要进入生成的静态文件目录（如 `build`，有 index.html 的目录）
    - GitHubPage
        - 项目放到 GitHubPage 的原理是新增一个分支 gh-pages，分支内容是项目静态文件的内容（build）
            - `gh-pages` 包
- `redux-promise-middleware` 包简化异步操作，减少需要定义的 action 的个数（hello-redux）
    - PENDING, FULFILLED, REJECTED
- `sfcookies` 包操作 cookie
- `rekit` 包在网页上写 React（rekit demo）
- `powerplug` 包简化代码
- UI 库
<!--    
    - <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet">   
    -  <link href="https://cdn.bootcss.com/semantic-ui/2.3.1/semantic.min.css" rel="stylesheet"> 
-->
- 中间件
    - action 和 reducer 中间
    - 多个中间件逐个处理 action（`next(action)`），没有下一个中间件了就到 reducer 中
- 异步
    - `fetch('https://randomuser.me/api/').then(res => res.json()).then(json => console.log(json));console.log('hello');`
- 热模块加载 HMR（开发模式下用）（hello-redux）
    - React 改代码后页面会刷新，热加载则页面不会刷新，只有更改的部分会生效，其它页面不变
- mongodb

    ```
    brew info mongodb
    brew services start mongodb
    brew services restart mongodb

    mongo
    use crud    # 数组库名
    db.games.find({}).pretty()  # games 表名
    ```

    - `mongodb` 包（crud/backend/server.js）
    - collection 相当于关系型数据库的表（table）
- [ ] 何时 `fetch`（异步操作）后要 `return` 回来
    - 异步抛出错误，要交由调用者（组件）去处理而不是在原地处理时（crud 处理错误路由处）
# React
- 父组件里写了子组件，并且在子组件上放置了一些属性，就是父组件在往子组件传数据；该子组件在它定义代码里就可以通过 `this.props` 访问到
- 组件写法
    1. ES5 `React.createClass()`
        - 接受一个对象为参数
        - 对象中必须声明一个 `render()` 方法
        - `render()` 返回一个组件实例
        - 用于创建有状态组件
        - 组件会被实例化，组件可以访问组件生命周期方法
        - React 会自动绑定方法（如 `this`），导致不必要的性能开销
    2. ES6 `class`
        - 适用于创建有状态组件
        - 由用户手动绑定 `this` 到当前函数的作用域
    3. 无状态函数（纯组件写法）
        - 函数写法，只有一个 `return` 语句
        - 适用于以下两种情况
            1. 不处理用户输入，组件所有数据都依赖 props 传入
            2. 不需要用到声明周期函数
        - 代码简洁，占内存小；由于函数式声明的特性无需绑定 `this`，减少很多性能开销；可以写成无副作用的纯函数
        - 优化性能可以用 `shouldComponentUpdate` 钩子，也可以用 `PureComponent`（ES6 写法）
        - > 要为无状态组件加入状态、生命周期时，要用到**高阶组件**（HOC），会返回组件的组件（会返回组件的函数）
- 子组件通过**回调函数**向父组件传值
    - 父组件传自己的函数（`foo(...arguments)`）给子组件
    - 子组件注册相应的事件处理器，响应用户动作（如 `onClick=this.handleFoo()`
    - `handleFoo()` 的功能是传入子组件自身的参数来调用父组件传过来的函数
        
        ```js
        handleFoo = () => {
            this.props.foo(this.state)`;
        }
        ```

    - 结果是子组件调用到了父组件的函数
- 兄弟节点之间通过**父亲节**点来传值
    - 子组件 A 要向子组件 B 传数据
    - 子组件 A 通过以上方法向父组件 B 传递 data
        - 方法做的事是调用父组件的 `setState()` 
    - 父组件的将 data 置于自己的 state 对象中，`setState()` 更新后，子组件 B 对应的属性也得到了更新
- 生命周期
    - Mounting
        - `constructor()`
        - `componentWillMount()`
        - `render()`
        - `componentDidMount()`
    - Updating
        - `componengWillReceiveProps()`
        - `shouldComponentUpdate()`
        - `componentWillUpdate()`
        - `render()`
        - `componentDidUpdate()`
    - Unmounting
        - `componentWillUnmount()`
    - > [React 组件生命周期](http://www.runoob.com/react/react-component-life-cycle.html)
- props 若是通过异步得到的，刚开始没有，要通过 `componentWillReceiveProps(nextProps)` 来处理

    ```js
    componentWillReceiveProps(nextProps) {
      this.setState({
        _id: nextProps.game._id,
        title: nextProps.game.title,
        cover: nextProps.game.cover
      })
    }
    ```

- `componentDidCatch`
    - 将可能出错的组件包起来，即使出错了也不响应其它组件的渲染，使页面不至于整个崩溃
    - 被包裹的子组件树上的组件都能捕获到
    - > 开发环境点击 `x` 就可关闭错误提示信息；线上环境不用点 
- `context` 
    - 将上层父组件的属性一步传到多层嵌套的子组件而不用依靠中间的组件层层传递（verification/Pure.js）
- 新的 `context` API
    - verification/NewContextAPI
    - verification/Flags
    - reminder/reminder-new_context_api
- 高阶组件
    - 是一个函数，接受组件作为参数，返回一个包裹后的组件（verification/hoc）
    - 可用于重构代码（hoc/withFetch）
    - 外层组件传进来的 props 和高阶组件显式给被包裹组件加上的属性一同构成了最终生成的组件的 props   
        - 高阶组件会传给被包裹组件的属性只有明确写出来的那些啊
- Render Props
    - 多层高阶组件的属性源不清晰；同名还存在覆盖问题
    - 清晰（verification/RenderProps.js）
- `defaultProps` 的两种写法
    1. `Hello.defaultProps = {}`
    2. `static defaultProps = {}`（组件要用 `class` 写法）
- `PropTypes`
    - `PropTypes.oneOfType([])` 
    - `PropTypes.arrayOf(PropTypes.shape({}))`
- `input` 有 `defaultValue` 属性
- 双向数据绑定：View 和 Model 有一方更新，另一方也会更新
- JSX `{}` 里的表达式只能是一行
# Redux
- store 由所有有状态组件的 state 组成，一个组件的 state 发生改变，store 就会发生改变，使得整个 app 的 UI 都得以更新
- action 代表要发生的动作，并带 UI 的参数过来
- reducer 返回新 state，使得 store 发生变化
- 纯 redux 写法里， `store.subscribe(cb)` 里订阅过的方法（`cb`）在 store 更新后才会被调用
- `mapStateToProps` 把 store 上的 state 导到组件中来，组件通过 `this.props.propName` 访问
- `connect()` 没传 `mapDispatchToProps` 方法时组件可以通过 `this.props.dispatch` 方法取到 `dispatch` 方法
- 只有一个 reducer 时若用了 `combineReducer()`，该 reducer 在 state 中是没有对应的 key 的，打印出来看一下！
- 传 action 到组件的方法（hello-redux/App.js）
    1. `connect` 方法**不传** `mapDispatchToProps` 参数，组可以通过 `this.props.dispatch` 取到 `dispatch` 方法来 `dispatch(action)`
        - 传了 `mapDispatchToProps` 就取不到 `dispatch` 方法了 
    2. 传 `mapDispatchToProps` 参数

        ```js
        const mapDispatchToProps = dispatch => {
          return { onTodoClick: id => { dispatch(toggleTodo(id)) } }
        }
        ```

        - 参数要对应起来，不太方便

    3. 用 `bindActionCreators` 方法

        ```js
        import { bindaActionCreators } from 'redux';
        const mapDispatchToProps = dispatch => {
          return { increment: bindActionCreators(increment, dispatch) };
        // 这样写也可以，这种写法可以放多个 action
        // return bindActionCreators({ increment， decrement }, dispatch); 
        }; 

        // 导入全部
        import * as actions from './actions';
        const mapDispatchToProps = dispatch => {
          return bindActionCreators(actions, dispatch); 
        }; 
        ```

        - 不用写参数
        - action 很多时可以用 `bindActionCreators` 批量导入
    4. 把 action 放在一个对象里作为 `connect()` 的第二个参数直接传

        ```js
        export default connect(mapStateToProps, { increment, decrement })(App);
        ```

    5. ES6 装饰器写法 `@`
        - 要先卸载 `create-react-app` 自带的 `react-script` 模块，安装 `custom-react-scripts` 包
# `react-router`
- SPA 的 HTML 内容由 JS 生成
- 带 `#` 的地址用 `HashRouter`；不带的用 `BrowserRouter`
- index.js 里只 render 一个 App 组件，App 里写路由

    ```jsx
    class App extends Component {
      render() {
        return (
          <Router>
            <div>
            <NavBar />
            <Jumbotron />
            <Route exact path="/" component={ Home } />
            <Route path="/contact/:id" component={ Contact } />
            <Route exact path="/contact" component={ Contact } />
            <Footer />
            </div>
          </Router>
        );
      }
    }
    ```

- `Router` 标签里的 `Route` 是 `path` 对应上才显示的，其它组件则是是所有页面上都会显示的
- 点击跳转（simple-app/Home.js)
    1. `this.props.history.push('path')`
        - `<Route path="/signup" component={SignupPage} />` 里 `component` 属性里写的组件才有 `history` 字段（一些嵌套在里面的组件没有的 `props` 里没有 `history` 属性
        - 没有的可以通过有的父组件传过来
    2. 组件直接用 react-router 的高阶组件 `withRouter` 包起来，就有 `history` 属性
    3. 使用 `context` 方法

        ```JSX
        import PropTypes from 'prop-types'

        class F extends Component {
          static contextTypes = {
            router: PropTypes.object
          }
        }

        // this.context.router.history
        ```

- 取参数

    ```jsx
    <Route path="/contact/:paramName" component={ Contact } />

    // this.props.match.params.paramName 取
    ```

- 处理错误路由的套路（crud/server.js）
    - 使用中间件
- `Redirect`

    ```js
    return (
      <div>
        { this.state.done ? <Redirect to="/games" /> : form }
      </div>
    );
    ```