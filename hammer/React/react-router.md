- `create-react-app` 创建的 React 应用，访问一个 public 目录下存在的资源时返回该资源，否则返回 `index.html`
- Router 和 Route 都是组件
    - Router 代表整个路由器，一个应用只需一个
    - Route 代表每个路径对应页面的路由规则
- Link 组件支持路由链接，产生 HTML 链接元素，且对该链接元素的点击操作不会引起网页跳转，被 Link 拦截，把目标路径发送给 Router 路由器
- IndexRoute 代表一个 Route 下的默认路由
- Router 的子组件只能是 Route 或 IndexRoute
- 嵌套链接

    ```jsx
    // Routes.js
    const Routes = () => (
        <Router history={history}>
            <Route path="/" component={App} />
                <IndexRoute component={Home} />
                <Route path="home" component={Home} />
                <Route path="about" component={About} />
            </Route>
        </Router>
    );

    // App.js
    const App = ({children}) => {
        return (
            <div>
                <TopMenu />
                <div>{children}</div>
            </div>
        );
    };

    // TopMenu
    const TopMenu = () => {
        return (
            <div>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </div>
        );
    };
    ```

    - 访问 `/home` 时，先根据路径 `/` 找到 component 为 App 的 Route
    - 再根据 `home` 找到 component 为 Home 的 Route
    - react-router 渲染外层 Route 相关的组件，再把内层 Route 组件作为 `children` 传递给外层组件
    - 最终 TopMenu 和 Home 都显示在页面上
- 唯一数据源不是说所有数据要存储在一个地方，而是一个特定的数据只保存在一个地方
- 可以利用 `react-router-redux` 库来同步浏览器 URL 和 Redux 的状态
- **`react-router-redux` 在 Redux Store 状态树上 `routing` 字段中保存当前路由信息**
    - 由于修改 Rudex 中的只能通过 reducer，要增加 `routing` 字段上的规约函数 `routerReducer`
    - reducer 要由 action 驱动，传给 Router 的 history 变量也能协同 URL 和 Store 上的状态

    ```jsx
    // Store.js
    import {routerReducer} from 'react-router-redux';
    const reducer = combineReducers({
        routing: routerReducer
    });

    // Routes.js
    import {syncHistoryWithStore} from 'react-router-redux';
    const history = syncHistoryWithStore(history, store);
    ```

    - 浏览器 URL 变化时，store 派发 action 对象，同时监听 store 的状态变化，当状态树下 routing 字段发生变化时，反过来会更新浏览器 URL
- `hashHistory` 管理 url 的 hash，加上额外的 junk 来 shim some behavior the browser has natively when using real urls
- `activeStyle`，`activeCXSlassName`
- url 参数：`:`
- [clean url](https://github.com/reactjs/react-router-tutorial/tree/master/lessons/10-clean-urls)
- [登录跳转](https://github.com/reactjs/react-router-tutorial/tree/master/lessons/12-navigating)