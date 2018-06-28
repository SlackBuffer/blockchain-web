# Rails365
- mock.js, less, roadhog, antd
- 切换 history 为 browserHistory
- 判断是否是 spa
    - curl（或用 postman）一个不同 path 的 url 看返回的内容是否相同
- history api 支持用 js 控制浏览器历史
- `initialState` 优先级高于 model 中的 state
- 在容器组件 `connect`（定义在路由里的组件）可以传入更多内容，如 `history`，`match`
    - 没有 `mapDispatchToProps` 时 `dispatch` 方法会被传入
# Knowledge map
- 析构加 alias

    ```js
    const add = (state, { payload: todo }) => {return state.concat(todo);}
    ```

- JSX 中用扩展运算符扩充组件 props

    ```jsx
    const attrs = {
        href: 'http://example.org',
        target: '_blank',
    };
    <a {...attrs}>Hello</a>
    ```

- React 可以通过 props，state，context 处理数据；dva 只需关心 props 
- CSS Modules：`button` class 在构建之后会被重命名为 `ProductList_button_1FU0u`，`button` 是 local name，`ProductList_button_1FU0u` 是 global name，可以用简短的描述性名字，而不需要关心命名冲突问题
    - CSS Modules 默认局部作用域，可用 `:global` 语法 声明全局规则

        ```css
        .title { color: red; }
        :global(.title) { color: yellow;}
        // 引用
        import styles from './style.css';
        <App className={styles.title}>
        <App className="title">
        ```

- 建议 state 最多一层嵌套，保持扁平化
- Effects
    - `put` 用于触发 action
    - `call` 用于调用异步逻辑（支持 promise）
    - `select` 用于从 state 获取数据（`const todos = yield select(state => state.todos);`）
- 错误处理
    - dva 里 effects 和 subscriptions 的抛错全部会走 `onError` hook，可以在 `onError` 里统一处理错误

        ```js
        const app = dva({
            onError(e, dispatch) {
                console.log(e.message);
            },
        });
        ```

        - effects 里的抛错和 reject 的 promise 都会被捕获到
    - 本地 effects 的错误处理需要在 effect 内部加 `try-catch`

        ```js
        app.Model({
            effects: {
                *addRemote() {
                    try { // code goes here }
                    catch(e) { console.log(e.message) };
                }
            }
        });
        ```

- 异步请求基于 [whatwg-fetch](https://github.com/github/fetch)
- `subscriptions` 用于订阅一个数据源，然后根据需要 dispatch 相应的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等，格式为 `({ dispatch, history }) => unsubscribe`

    ```js
    app.model({
        subscriptions: {
            setup({ dispatch, history }) {
                history.listen(({ pathname }) => {
                    if (pathname === '/users') {
                        dispatch({
                            type: 'users/fetch'
                        });
                    }
                })
            }
        }
    })
    ```

    - 用户进入 `/users` 页面时触发 action `users/fetch` 加载用户数据
    - url 规则复杂可用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 简化

        ```js
        import pathToRegexp from 'path-to-regexp`;
        const match = pathToRegexp('/user/:userId/search').exec(pathname);
        if (match) {
            const userId = match[1];
        }
        ```

    - Route Component 会有额外的 props（injected props）用以获取路由信息：location，params，children
    - 基于 action 进行页面跳转

        ```js
        import { routerRedux } from 'dva/router';
        // inside Effects
        yield put(routerRedux.push('/logout'));
        // outside Effects
        dispatch(routerRedux.push('logout'));
        // with query
        routerRedux.push({
            pathname: '/logout',
            query: { page: 2 }
        });
        ```

- onAction 用于传入中间件，支持数组

    ```js
    import createLogger from 'redux-logger';
    const app = dva({ onAction: createLogger() })
    ```

- 切换 history 为 browserHistory

    ```js
    import { browserHistory } from 'dva/router';
    const app = dva({ history: browserHistory });
    ```

- 去除 hashHistory 下的 _k 查询参数
- `dva new myapp`
# React + Redux 最佳实践
## URL => Data
    - react-router + react-router-redux: 前者是业界标准，后者可以同步 route 信息到 state，这样便可以在 view 根据 route 信息调整展现，以及通过 action 来修改 route
## Data
### 方案
- plain object
    - 层次过深可用 updeep 库
### 可选
- immutable.js: 通过自定义的 api 来操作数据，需要额外的学习成本
    - 不熟悉 immutable.js 的可以先尝试用 seamless-immutable，JavaScript 原生接口，无学习门槛
- 不推荐用 redux-immutable 以及 redux-immutablejs，一是没啥必要，具体看他们的实现就知道了，都比较简单；更重要的是他们都改写了 combineReducer，会带来一些潜在的兼容问题
## Data => View
- 需求：数据的过滤和筛选
- 方案： [reselect](https://github.com/reduxjs/reselect)
    - store 的 select 方案
    - 可组合性和缓存机制
## View 的 CSS
- [css-modules](https://github.com/css-modules/css-modules): 配合 webpack 的 css-loader 进行打包，会为所有的 class name 和 animation name 加 local scope，避免潜在冲突
## Action <=> Store
- 需求：统一的业务逻辑，尤其是异步的处理
- redux-saga
## Data <=> API Server
- 需求：异步请求
- 方案：[isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch): 便于在同构应用中使用，写 node 和 web 用同一套 api 
    - 通过 async + await 组织代码
# dva
- dva = React-Router + Redux + Redux-saga
- model 的 key
    - namespace - 对应 reducer 在 combine 到 rootReducer 时的 key 值
    - state - 对应 reducer 的 initialState，该 Model 的当前状态，数据保存处，直接决定视图层的输出
    - subscription - elm@0.17 的新概念，在 dom ready 后执行
        - 订阅：组件坐等消息
        - > [A Farewell to FRP](http://elm-lang.org/blog/farewell-to-frp)
    - effects - 对应 saga，并简化了使用，action 处理器，处理异步动作；计算以外的都属于 Effect，典型的如 I/O 操作、数据库读写
        - Effect 是 Generator 函数，内部使用 yield 关键字标识每一步操作（无论同步或异步）
        - call 执行异步函数，put 发出一个 action，类似 dispatch
    - reducers - action 处理器，处理同步动作，计算出最新的 state
- 流程
    <!-- 1. 使用 antd -->
    1. 定义路由
    2. 写 UI 组件
    3. 定义 Model
    4. connect
- umi 中文件即路由，要新增路由只需新建文件
- 数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 dispatch 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State ，如果是异步行为（副作用）会先触发 Effects 然后流向 Reducers 最终改变 State
- 可以通过 dva 的实例属性 _store 看到顶部的 state 数据

    ```js
    const app = dva();
    console.log(app._store);
    ```

- action 是改变 state 的唯一途径，action 描述一个行为，dispatch 是触发行为的方式，reducers 描述如何改变数据
- dispatch 在组件 connect model 后通过 props 传入
- Effect 被称为副作用，最常见的是异步操作
    - 称之为副作用是因为函数因它而不纯，同样输入不一定获得同样的输出
- subscription 是一种从源获取数据的方法，订阅一个数据源，然后根据条件 dispatch 相应的 action
    - 数据源可以是当前的事件、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化

    ```js
    import key from 'keymaster';
    app.model({
        namespace: 'count',
        subscriptions: {
            keyEvent(dispatch) {
                key('⌘+up, ctrl+up', () => { dispatch({ type: 'add' }) });
            }
        }
    });
    ```

- 通过浏览器提供的 History API 可以监听浏览器 url 变化

    ```js
    import { Router, Route } from 'dva/router';
    app.router({ history }) => {
        <Router history={history}>
            <Route path="/" component={HomePage} />
        </Router>
    };
    ```

    - dva 通常将 Container Components 约束为 Route Components，以页面维度来设计 Contanier Components
    - 通常需要 connnect Model 的组件都是 Route Comonents，组织在 `/routes/` 目录下，`/components/` 目录下是 presentational components