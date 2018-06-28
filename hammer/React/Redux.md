# Redux
- [ ] [ActionTypes 啰嗦的名字 why](https://redux.js.org/recipes/reducing-boilerplate)
- Redux 负责管理应用的 state
- 主旨（Gist）
    - The whole state of your app is stored in an object tree inside a single `store`
    - The only way to change the state tree is to emit an action, an object describing what happened
        - > This ensures that neither the views nor the network callbacks will ever write directly to the state. Instead, they express an intent to transform the state. Because all changes are centralized and happen one by one in a strict order, there are no subtle race conditions to watch out for. As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes
    - To specify how the actions transform the state tree, you write pure reducers
- Reducers are just pure functions that take the previous state and an action, and return the next state
    - Because reducers are just functions, you can control the order in which they are called, pass additional data, or even make reusable reducers for common tasks such as pagination
- Redux does not have the concept of a `Dispatcher` because it relies on pure functions instead of event emitters, and pure functions are easy to compose and don't need an additional entity managing them
- 基本原则
    - 唯一数据源
        - 应用的数据状态只应存在唯一的 store 上
            - Redux 并未禁止多个 store，但多个 store 没有好处
            - > Flux 架构的应用可以有多个 store
        - 唯一 Store 上的状态是一个树形对象
            - 每个组件只用到树形对象的一部分数据
            - 核心问题是设计 store 上状态的结构
            - Redux 状态设计的主要原则是避免冗余数据
    - 保持状态只读
        - 不能直接修改 store 状态，只需通过派发 action 对象完成
        - 改变状态的方法不是去修改状态上的值，而是创建一个新的状态对象返回给 Redux，由 Redux 完成新的状态组装
    - 数据改变只能通过纯函数（Reducer）完成
        - `reducer(state, action)`
            - `state` 是当前状态，`action` 是接收到的 action 对象
            - reducer 根据 state 和 action 的值产生一个新的对象并返回
            - reducer 必须是纯函数，返回结果完全由参数决定，无副作用（包括不能修改 state，action 对象）
        - Redux = Reducer + Flux
        - JS `reduce()` 函数接受的参数（一个函数）是一个 reducer，`reduce()` 对每个元素都调用一次参数 reducer
- `return {...state, [caption]: state[caption] + 1};` 等同于

    ```js
    const newState = Object.assign({}, state);
    newState[caption] += 1;
    return newState;
    ```

    - 避免对原 state 对象的修改
- Redux 中 action 构造函数只负责创建对象，View 里调用 `store.dispatch` 来派发 action
    - Flux 中 action 构造函数创建 action 对象并派发 action
- Redux 把 state 的管理交给 Redux 框架本身，reducer 只管如何更新 state 而无需关系 state 如何存储
    - Flux 中 state 由 store 管理
- store enhancer 让 `createStore` 生成的 store 有更多功能
- `compose` 用于把多个 store enhancer 组合起来
- `redux-immutable-state-invariant` 让 Redux 在每次派发动作之后做一个检查，若有 reducer 违反纯函数规则修改参数 state就会给出错误警告
    - 只在开发环境下用，生成环境给出错误提示无意义
## Redux view
- 组件状态需显式调用 `store.getState()` 获取
- 在（HTML）元素上为用户的动作如点击（`onClick`）注册事件处理器；事件处理函数做的事是派发此动作
    - `store.dispatch(specificAction)`
- Redux store 将 currentState 和 action 传给 reducer，reducer 根据动作类型调用自身逻辑更新状态，store 将 new state 保存；store 更新后每个注册过 `store.subscribe()` 的 listener 都会被调用
- 组件的生命周期函数负责监听 store 变化，监听到 store 的变化后执行（`subscribe` 里的）回调函数
    - `componentDidMount()`: `store.subscribe(callbackA)`
    - 回调函数（`callbackA`）做的事是调用 `setState()` 更新 UI（**手动更新**）
    - 停止监听：`componentWillUnmount`: `store.unsubscribe(callbackA)`
- **View 里直接导入 store 模块**
## Redux store
- `createStore(redecer)`
    - Redux 的 `createStore` 只接受一个 reducer，多个 reducer 需要先组合
## 聪明件，傻瓜件
 - 在 Redux 的基础上把组件分成容器组件和展示组件
    - 容器组件负责和 React Store 交互，又称 smart component
    - 展示组件负责渲染界面，又称 dumb component
    - 容器组件传 props 给展示组件
    - 傻瓜组件是纯函数，根据 props 产生结果，不需要有状态
- 对于无状态组件，React 支持只用一个函数来表示
- 获取 store 信息，监听、派发、响应动作的操作在 smart 组件上完成
- 仍然在 dumb 组件的（HTML）元素上为用户的动作如点击（`onClick`）注册事件处理器
    - 事件处理器函数由 smart 组件传进来，dumb 组件通过 props 读取
    - dumb 组件上要显示的值也由 smart 传进来，通过 props 读取
    - 事件处理函数做的事是派发此动作 `store.dispatch(specificAction)`
- smart 组件的父组件会向 smart 组件传状态，smart 组件通过 props 读取
- **View 里直接导入 store 模块**
- 聪明组件和傻瓜组件是 React 组件的一种设计模式，和 Redux 没有直接关系
## 上下文
- 独立开发组件时，无法知道的值逐渐会存在哪个应用，也就不可能知道 Redux store 的位置，我已在文件中直接导入 store 不利于组件复用
- Context
    - 上下文环境让一个树状组件上所有组件都能访问一个共同的对象
    - 上级组件宣称自己支持 context，提供一个函数用来返回代表 context 的对象
    - 此上级组件下的所有子孙组件宣称自己需要调用此 contex，通过 this.context 访问到共同的环境对象
    - 自然，顶层组件来扮演 context 提供者的角色是合适的
    - 不过每个组件的顶层组件不同，且顶层组件有自己的职责，没理由把它复杂化
    - 特殊组件 `Provider` 作为通用的 context 提供者
- 单独定义 `Provider` 模块
    - `getChildContext()`
    - `childContextTypes`
    - `render() { return this.props.children }`
- 在 `src/index.js` 里导入 store、provider 模块，通过 `Provider` 提供统一的 store 接口
    - 用 `<Provider store={store}></Provider>` 包起来
- View 里组件要声明 `contextTypes`
- 用 `this.context.store` 访问 store
# react-redux
- React-Redux 库将拆分傻瓜、聪明组件和抽离 Provider 组件的套路分离出来
    - `connect` 连接容器组件和傻瓜组件
        - `connect` 的执行结果是一个函数
        - `connect` 函数将 store 上的状态转化为傻瓜组件的 props；把内层傻瓜组件的用户 action 转化为派送给 store 的动作
            - 通过定义事件处理器，而事件处理器通过调用 `mapDispatchToProps` 从容器组件传进来，做的事是 dispatch 特定的 action
    - `Provider` 提供包含 store 的 context
        - `Provider` 模块由 `react-redux` 提供，无需手写
## react-redux view
- 从 `react-redux` 引入 `connect`
- 无需手动创建 smart 组件，调用 `connect`（传入“傻瓜”组件）自动生成 smart 组件
    - 写法回到纯 Redux，实际手写的只有一个 dumb 组件
- 组件状态调用 `connect` 自动获取
- store 的状态管理交给 helpler（`connect`），无需手动写 `store.subscribe()`，`setState()`，只要写好 `connect` 的两个函数
### `connect`
- `mapStateToProps` transforms the current Redux store state into the props you want to pass to a presentational component you are wrapping
- `mapDispatchToProps()` receives the `dispatch()` method and returns callback props that you want to inject into the presentational component
- `mapStateToProps(state, ownProps)`，`mapDispatchToProps(dispatch, ownProps)`
    - `ownProps` 是“聪明”组件从它的父组件获得数据的地方
    - `state`: store 里的那个对象
    - `mapDispatchToProps` 给 dumb 组件传入它声称要的方法
    - `mapStateToProps` 给 dumb 组件传入它声称要的 store 状态
- `[mapStateToProps(state, [ownProps]): stateProps]` (Function)
    - 若有此方法传入 `connect`，组件会订阅 Redux store 的更新（自动做了 `store.subscribe()` 做的事），一旦 store 发生更新，`mapStateToProps` 就会被调用
    - `mapStateToProps` 的结果一定要是一个**纯对象**，它会被并入组件的 props
    - 不需要订阅 store 更新的话传入 `null` 或 `undefined` 作为 `connect` 的第一个参数
    - `state` 是整个的 Redux state
    - > If your `mapStateToProps` function is declared as taking two parameters, it will be called with the store state as the first parameter and the props passed to the connected component as the second parameter, and will also be **re-invoked** whenever the connected component receives new props as determined by shallow equality comparisons. (The second parameter is normally referred to as `ownProps` by convention.)
- `[mapDispatchToProps(dispatch, [ownProps]): dispatchProps]` 
    - 返回结果是 an object with the same function names, but with every **action creator wrapped into a `dispatch` call** (so they may be invoked directly); it will be **merged** into the component’s props.
    - Will be re-invoked whenever the connected component receives new props. (The second parameter is normally referred to as `ownProps` by convention.)
    - If you do not supply your own `mapDispatchToProps` function or object full of action creators, the default `mapDispatchToProps` implementation just injects `dispatch` into your component’s props.
---
- Technically, a container component is just a React component that uses `store.subscribe()` to read a part of the Redux state tree and supply props to a presentational component it renders. You could write a container component by hand, but we suggest instead generating container components with the React Redux library's `connect() `function, which provides many useful optimizations to prevent unnecessary re-renders. (One result of this is that you shouldn't have to worry about the React performance suggestion of implementing `shouldComponentUpdate` yourself.)
- To use `connect()`, you need to define a special function called `mapStateToProps` that tells how to transform the current Redux store state into the props you want to pass to a presentational component you are wrapping
- In addition to reading the state, container components can dispatch actions. In a similar fashion, you can define a function called `mapDispatchToProps()` that receives the `dispatch()` method and returns callback props that you want to inject into the presentational component.
    - For example, we want the `VisibleTodoList` to inject a prop called `onTodoClick` into the `TodoList` component, and we want `onTodoClick` to dispatch a `TOGGLE_TODO` action
- `[mapStateToProps(state, [ownProps]): stateProps] (Function)`: If this argument is specified, the new component will subscribe to Redux store updates. This means that any time the store is updated, `mapStateToProps` will be called. The results of `mapStateToProps` must be a plain object, which will be merged into the component’s props. If you don't want to subscribe to store updates, pass `null` or `undefined` in place of `mapStateToProps`
- If your `mapStateToProps` function is declared as taking two parameters, it will be called with the store state as the first parameter and the props passed to the connected component as the second parameter, and will also be re-invoked whenever the connected component receives new props as determined by shallow equality comparisons. (The second parameter is normally referred to as `ownProps` by convention.)
    - The `mapStateToProps` function's first argument is the entire Redux store’s state and it returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data
## 要点
- action 产生 -> reducer 生成新状态 -> **所有** `connect` 都被调用 -> 各 `connect` 更新对应的傻瓜组件的 state，引发渲染，页面得到更新
- 整个 app 的 state 是一个唯一的对象，子 reducer 返回的不一定是对象，它的返回值会被并入 state
    - reducer 的返回值交由 `mapStateToProps`，由它来传给 dumb 组件并渲染出来，而 `mapStateToProps` 的返回值一定是对象
    - `mapStateToProps` 和 `mapDispatchToProps` 返回的对象最终都会合并到 props
    - 各子 reducer 返回的类型由 store 的状态树决定
    - 状态树的设计按照应用的需要选择不同数据类型
- 当一个包含 `ref` 属性的组件完成装载后，若 `ref` 属性值是一个函数，则会调用该函数，传入的参数即该组件代表的真实 DOM 元素，通过这种方法了访问真实的 DOM 元素
- 构建新应用
    1. 代码文件的组织结构
        - 按功能组织
    2. 确定模块的边界
        - 各个模块的对外接口都确定为 index.js
        - 导入目录时默认导入的就是该目录下的 index.js
    3. Store 状态树的设计
        - > [design the state shape](https://redux.js.org/basics/reducers#designing-the-state-shape)
# 中间件
- 在 action 派发出来之后、到达 reducer 之前提供处理 action 的机会
# Redux API
## `createStore()`
- Creates a Redux store that holds the complete state tree of your app.
    - There should only be a single store in your app.
- `createStore(reducer[, preloadedState][, enhancer])`
    - `preloadedState`
        - The initial state. You may optionally specify it to hydrate the state from the server in universal apps, or to restore a previously serialized user session. 
        - If you produced reducer with `combineReducers`, this must be a plain object with the same shape as the keys passed to it. 
        - Otherwise, you are free to pass anything that your reducer can understand.
    - `enhancer`
        - You may optionally specify it to enhance the store with third-party capabilities such as middleware, time travel, persistence, etc.
    - 返回值是包含整个 app 状态的一个对象
- store 创建后，Redux 会派发一个 dummy action 给 reducer，将 store 用提供的初始状态初始化
    - dummy action 不用开发者手动处理
    - 初始化时，若作为第一个参数传给 reducer 的 state 是 `undefined`，reducer 要返回合适的初始状态
- 要修改 store 里的 state 只能通过给 store 派发 action
## store
- store 将 action 和 reducer 联结起来
- store 的初始值可以在 `createStore` 的第二个参数里指定
- 一个 Redux app 只能有一个 store，要分离数据处理逻辑只需划分多个 reducer
    - `getState()`
        - Returns the current state tree of your application.
        - It is equal to the last value returned by the store's reducer.
    - `dispatch(action)`
        - The store's reducing function will be called with the current `getState()` result and the given action synchronously. 
        - Its return value will be considered the next state. It will be returned from `getState()` from now on, and the change listeners will immediately be notified.
        - > In Redux, subscriptions are called **after** the root reducer has returned the new state, so you may dispatch in the subscription listeners. You are only disallowed to dispatch inside the reducers because they must have no side effects. If you want to cause a side effect in response to an action, the right place to do this is in the potentially async action creator.
    - `subscribe(listerer)`
        - To unsubscribe the change listener, invoke the function returned by `subscribe`
    - `replaceReducer(nextReducer)`
        - > You might need this if your app implements code splitting, and you want to load some of the reducers dynamically. You might also need this if you implement a hot reloading mechanism for Redux.
## Reducer
- `(previousState, action) => newState`
- It's called a reducer because it's the type of function you would pass to `Array.prototype.reduce(reducer, ?initialValue)`. 
- It's very important that the reducer stays pure. Things you should never do inside a reducer:
    - Mutate its arguments;
    - Perform side effects like API calls and routing transitions;
    - Call non-pure functions, e.g. `Date.now()` or `Math.random()`.
    - > 这些操作应在 action 派发之前完成
- Redux will call **reducer** with an `undefined` state for the first time. This is our chance to return the initial state of our app

    ```js
    const initialState = {
      visibilityFilter: VisibilityFilters.SHOW_ALL,
      todos: []
    }
    
    function todoApp(state = initialState, action) {
      switch (action.type) {
        case SET_VISIBILITY_FILTER:
          return Object.assign({}, state, {
            visibilityFilter: action.filter
          })
        default:
          return state
      }
    }
    ```
    
    - 为无法识别的 action 返回 state
- 手写的 root reducer

    ```js
    function todos(state = [], action) {
      switch (action.type) {
        case ADD_TODO:
          return [
            ...state,
            {
              text: action.text,
              completed: false
            }
          ]
        case TOGGLE_TODO:
          return state.map((todo, index) => {
            if (index === action.index) {
              return Object.assign({}, todo, {
                completed: !todo.completed
              })
            }
            return todo
          })
        default:
          return state
      }
    }
    
    function visibilityFilter(state = SHOW_ALL, action) {
      switch (action.type) {
        case SET_VISIBILITY_FILTER:
          return action.filter
        default:
          return state
      }
    }
    
    function todoApp(state = {}, action) {
      return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
      }
    }
    
    // equivalent to 
    const todoApp = combineReducers({
        visibilityFilter,
        todos
    })
    ```
    
- reducer

    ```js
    const reducer = combineReducers({
      a: doSomethingWithA,
      b: processB,
      c: c
    });
    
    function reducer(state = {}, action) {
      return {
        a: doSomethingWithA(state.a, action),
        b: processB(state.b, action),
        c: c(state.c, action)
      }
    }
    ```

- 若状态未发生改变，reducer 不会生成新的 state object
## `combineReducers()`
- `combineReducers()` 生成一个函数；该函数根据子 reducer 的 key 取出对应的状态切片，传入子 reducer 以调用子 reducer；最后将各子 reducer 的返回结果重新合并成一个对象
- It's just a helper for convenience
- All `combineReducers()` does is generate a function that calls your reducers with the slices of state selected according to their keys, and combining their results into a single object again
- The `combineReducers` helper function turns an object whose values are different reducing functions into a single reducing function you can pass to `createStore`
- The resulting reducer calls every child reducer, and gathers their results into a single state object
- The state produced by `combineReducers()` namespaces the states of each reducer under their keys as passed to `combineReducers()`
- A popular convention is to name reducers after the state slices they manage
- Any reducer passed to the default `combineReducers` must satisfy these rules:
    - For any action that is not recognized, it must return the `state` given to it as the first argument.
    - It must never return `undefined`. It is too easy to do this by mistake via an early `return` statement, so `combineReducers` throws if you do that instead of letting the error manifest itself somewhere else
    - If the `state` given to it is `undefined`, it must return the initial state for this specific reducer. According to the previous rule, the initial state must not be `undefined` either. It is handy to specify it with ES6 optional arguments syntax, but you can also explicitly check the first argument for being `undefined`
- While `combineReducers` attempts to check that your reducers conform to some of these rules, you should remember them, and do your best to follow them
    - `combineReducers` will check your reducers by passing `undefined` to them; this is done even if you specify initial state to `Redux.createStore(combineReducers(...), initialState)`. Therefore, you must ensure your reducers work properly when receiving `undefined` as state, even if you never intend for them to actually receive `undefined` in your own code