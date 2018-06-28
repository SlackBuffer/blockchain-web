[dva-knowledgemap](https://github.com/dvajs/dva-knowledgemap#router)
# JS
- 不用 `var`，用 `const` 和 `let`
- 模板字符串，默认参数
- 箭头函数
    - 继承上下文 `this`

    ```js
    [1, 2, 3].map(x => x + 1);  // [2, 3, 4]

    // equivalent to 
    [1, 2, 3].map((function (x) {
        return  x + 1;
    }).bind(this));
    ```
    
## import, export

```js
// 引入全部
import dva from 'dva';

// 引入部分
import { connect } from 'dva';
import { Link, Route } from 'dva/router';

// 引入全部，比作为 github 对象
import * as github from './services/github';

// 导出默认
export default App;
// 部分导出，通过 import { App } from './file'; 来引入
export class App extend Component {};
```

## ES6 对象和数组
- 析构赋值

    ```js
    // object
    const user = { name: 'a', age: '1' };
    const { name, age } = user;
    console.log(`${name} : ${age}`);    // a : 1

    // array
    const arr = [1, 2];
    const [foo, bar] = arr;
    console.log(foo);   // 1

    // 析构函数参数
    const add = (state, { key: payload }) => {
        return state.concat(payload);
    };
    let b = 1;
    add('a', { key: b });
    ```

- 改进字面量

    ```js
    const name = 'a';
    const age = 1;
    const user = { name, age };     // {name: "a", age: 1}
    ```

    - 定义对象方法时省去 `function` 关键字

        ```js
        app.model({
            reducers: {
                add() {} // 等同于  add: function () {}
            },
            effects: {
                *addRemote() {}     // 等同于 addRemote: function*() {}
            }
        })；
        ```

## Spread operator
- 组装数组

    ```js
    const todos = ['dva'];
    [...todos, 'abc'];  // ["dva", "abc"]
    ```

- 获取数组部分项

    ```js
    const arr = ['a', 'b', 'c'];
    const [first, ...rest] = arr;
    rest;   // ["b", "c"]

    const [f, , ...r] = arr;
    r;      // ["c"]
    ```

- 收集函数参数为数组

    ```js
    function foo(first, ...rest) {
        console.log(rest);
    };
    foo('a', 'b', 'c'); // ["b", "c"]
    ```

- 代替 `apply`

    ```js
    function foo(x, y, z) {}
    const args = [1, 2, 3];

    foo.apply(null, args);
    // equivalent to 
    foo(...args);
    ```

- 合成新对象

    ```js
    const foo = {
        a: 1,
        b: 2,
    };
    const bar = {
        b: 3,
        c: 2,
    };
    const d = 4;

    const ret = { ...foo, ...bar, d };  // { a:1, b:3, c:2, d:4 }
    ```

## Promises
## Generators
- dva 的 effects 通过 generator 组织。
- generator 返回迭代器，通过 `yield` 关键字实现暂停功能。

    ```js
    app.model({
        namespace: 'todos',
        effects: {
            *addRemote({ payload: todo }, { put, call }) {
                yield call(addTodo, todo);
                yield put({ type: 'add', payload: todo});
            }
        }
    });
    ```

    - 通过 `yield` 把异步逻辑通过同步方式组织起来。
# React component
- 3 种方式定义 component
    - `React.createClass`
    - `class`
    - **`Stateless function component`**
        - 是纯函数不是对象，没有 `this` 作用域

    ```js
    function App(props) {
        function handleClick() {
            props.dispatch({ type: 'app/create' });
        }
        return <div onClick={handleClick}>${props.name}</div>
    }

    // equivalent to 

    class App extends React.Component {
        handleClick() {
            this.props.dispatch({ type: 'app/create' });
        }
        render() {
            return <div onClick={this.handleClick.bind(this)}>${this.props.name}</div>
        }
    }
    ```

## JSX
- component 嵌套

    ```html
    <App>
        </Header />
        <MainContent />
        <Footer />
    </App>
    ```

- 样式用 `className` 而不是 `class`
- JS 表达式用 `{}` 括起来，会执行并返回结果。 `<h1>{ this.props.title }</h1>`
- 数组映射为 JSX 元素列表

    ```html
    <ul>
        { this.props.todos.map((todo, i) => <li key={i}>{todo}</li> }
    </ul>
    ```

- 不用 `//` 单行注释。
- spread attributes

    ```js
    const attrs = {
        href: 'http://example.org',
        target: '_blank'
    };
    <a {...attrs}>hello</a>

    // equivalent to
    <a href={attrs.href} target="attrs.target"}>Hello</a>
    ```

## Props
- React 可以通过 `props`，`state`，`context` 处理数据。
- dva 只用 `props`。
- JS 弱类型，少用 `propTypes` 对 `props` 校验。
    - `PropTypes.array`
    - `PropTypes.bool`
    - `PropTypes.func`
    - `PropTypes.number`
    - `PropTypes.object`
    - `PropTypes.string`

    ```js
    function App(props) {
        return <div>{prop.name}</div>
    }
    App.propTypes = {
        name: React.PropTypes.string.isRequired,
    };
    ```

- 往下传数据
![d](https://camo.githubusercontent.com/ed04df6d56d8555cf99a754296b60f569b371663/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f4e417a654d79556f504d71786652762e706e67)
- 往上传数据
![u](https://camo.githubusercontent.com/a8ffad4e9534c1d1c651f10baa55c37250118b8d/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f66694b4b67444775454a66537678762e706e67)
- CSS module
    - `button` class 在构建后被重命名。`button` 是 local name，`ProductList_button_1FU0u` 是 global name。可以用简短的名字而无需考虑命名冲突的问题。
    - 在 css/less 文件里写 `.button {...}`，在组件里通过 `styles.button` 来引用。
    - 默认局部作用域
![img](https://camo.githubusercontent.com/d1341a45402a32a6112f7a99cd99341eab2abbad/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f535742775754625a4b7178774550712e706e67)
- 定义全局 CSS
    - `:global`

    ```css
    .title {
        color: red;
    }
    :global(.title) {
        color: yellow;
    }
    ```

- [`classnames`](https://github.com/JedWatson/classnames) 库

    ```js
    import classnames from 'classnames';
    const App = (props) => {
        const cls = classnames({
            btn: true,
            btnLarge: props.type  === 'submit',
            btnSmall: props.type === 'edit',
        });
        return <div className={ cls } />;
    }

    <App type="submit" />   // btn btnLarge
    <App type="edit" />     // btn btnSmall
    ```

# Reducer
- 一个函数，接受 `state` 和 `action`，返回老的或新的 `state`。`(state, action) => state`
- 增删改

    ```js
    app.model({
        namespace: 'todos',
        state: [],
        reducers: {
            add(state, { payload: todo }) {
                return state.concat(todo);
            },
            remove(state, { payload: id }) {
                return state.filter(todo => todo.id !== id);
            },
            update(state, { payload: updatedTodo }) {
                return state.map(todo => {
                    if (todo.id === updatedTodo.id) {
                        return { ...todo, ...updatedTodo };
                    } else {
                        return todo;
                    }
                });
            }
        }
    });
    ```

- 嵌套数据的增删改
    - 建议最多嵌套一层以保持 `state` 扁平化。
# Effects
- `put` 用于触发 action。`yield put({ type: 'todos/add', payload: 'dva' });`
- `call` 用于调用异步逻辑，支持 promise。`const result = yield call(fetch, 'todos');`
- `select` 用于从 state 获取数据。`const todos = yield select(state => state.todos);`
## 错误处理
- dva 里 effects 和 subscriptions 的抛错都走 `onErroe` hook，可以在 `onError` 里统一处理。

    ```js
    const app = dva({
        onError(e, dispatch) {
            console.log(e.message);
        }
    });
    ```

- 特殊处理需在 effects 内部加 `try-catch`。

    ```js
    app.model({
        effects: {
            *addRemote() {
                try {
                    // code
                } catch(e) {
                    console.log(e.message);
                }
            }
        }
    });
    ```

## 异步请求
- 基于 whatwg-fetch，[API](https://github.com/github/fetch)

    ```js
    import request from '../util/request';
    // GET
    request('/api/todos');
    // POST
    request('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ a: 1 })
    });
    ```

- 若后台约定返回如下格式，做统一的错误处理

    ```js
    {
        status: 'error',
        message: '',
    }
    ```

    - 编辑 `utils/require.js`，加入以下中间件：

        ```js
        function parseErrorMessage({ data }) {
            const { status, message } = data;
            if (status === 'error') {
                throw new Error(message);
            }
            return { data };
        }
        ```

        - 这样此类错误会走到 `onError` hook 里。
# Subscription
- `subscriptions` 用于订阅一个数据源，根据需要 dispatch 响应 action。
    - 数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。格式为 `({ dispatch, history }) => unsubscribe`。

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
                });
            }
        }
    });
    ```

    - 用户进入 `/users` 页面时触发 action `user/fetch` 加载用户数据。
- 若 url 规则比较负责，匹配和 useId 的获取会很麻烦，此时用 [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
# Router
- Config with JSX element (router.js)

    ```html
    <Route path="/" component={App}>
        <Route path="accounts" component={Accounts}/>
        <Route path="statements" component={Statements}/>
    </Route>
    ```

- Route Components 是指 `./src/routes/` 目录下的文件，他们是 `./src/router.js` 里匹配的 Component。
    - 通过 connect 绑定数据
    - injected props
- 基于 action 进行页面跳转
# dva 配置
# 通过 `dva-cli` 创建项目
- 接到项目后，用上帝模式做 state design
    1. 设计 models
    2. 设计 components
    3. 连接 models 和 components
- 安装 dva-cli

    ```
    npm install -g dva-cli
    ```

- 新建 App

    ```
    $ dva new myapp --demo
    $ cd myapp
    $ npm start         # Starts the development server.
    $ npm run build     # Bundles the app into dist for production.
    $ npm test          # Run test.
    ```

    - `--demo` 表示创建 demo 级别的 app