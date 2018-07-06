- 数据传递
  - 上下文
      - 侵入式
  - 事件订阅模式
      - 侵入式
  - redux
- redux 写法；react-redux 写法
- 传递 store
    1.  直接将 store 用 props 传入需要的组件
    1.  `connect(mapStateToProps)`
    1.  利用 context 
- dispatch
    1. 不传 mapDispachToProps 用 `this.props.dispatch()` 调用
    1. `connect(mapDispatchToProps)`
    2. `bindActionCreators`
        - actions 很多时用这种写法可以简化
    3. `connect(null, { increment, decrement })(App)` 这样用
- 中间件
    - action => middlewares => reducers
    - `applyMiddleware` 里中间件的执行顺序是从左到右
    - `next(action)` 调用下一个中间件；无下一个中间件可调就到 reducer 中去，再将控制交回最后一个中间件，依次返回
- 异步
    - 使用 redux-thunk：action 不返回对象，而是返回一个函数，函数里再去 dispatch 同步的 action（并传入数据）改变 state
        - 同步异步逻辑混在一起
    - `redux-promise-middleware` 简化 redux-thunk 的代码
- https://randomuser.me/api/
- `fetch`

    ```jsx
    const newFetch = (args) => {
        return fetch(args)
        .then(res => res.json())
        .then(user => {
            return user.results[0];
        });
    }

    function* fetch_user() {
        yield put({ type: IS_FETCHING_USER });
        try {
            const data = yield call(newFetch, 'https://rasndomuser.me/api/');
            yield put({ type: FETCH_USER_SUCCESS, user: data });  
        } catch (error) {
            yield put({ type: FETCH_USER_FAILED, error: error.message });
        }
    }

    export function* watchIncrementAsync() {
        yield takeEvery('user/fetch', fetch_user);
    }
    ```

- https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables
# 坑
- React 的 `{}` 的值，若 reducer 里的初始值设为对象，初始化时会报错
    - 给个有字段的 `initialState` 对象