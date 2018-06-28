- `yield` 语句可以放异步动作，这样可以用同步的写法写异步方法，避免回调地狱

    ```js
    function* gen() {
        var posts = yield $.getJSON("https://jsonplaceholder.typicode.com/posts");
        console.log(posts);
        var users = yield $.getJSON("https://jsonplaceholder.typicode.com/users");
        console.log(users);
    }

    run(gen);

    function run(generator) {
        var myGen = generator();
        function handle(yielded) {
            if (!yielded.done) {
                // 此处 yielded.value 是一个 promise
                yielded.value.then(function(data) {
                    return handle(myGen.next(data));
                })
            }
        }
        // 第一次调用 handle(myGen.next())
        // 第一次 handle 里递归调用第二次 handle(myGen.next(data))，data 传入 posts
        // 第二次调用 hadle，done 仍为 false,递归调用第三次 handle(myGen.next(data))，data 传入 users
        // 第三次调用，done 为 true
        return handle(myGen.next());
    }
    ```

- `takeEvery()` 每个动作都会被触发，`takeLatest()` 只会触发最新的一个
- 要返回 promise 的地方用 `call()` 包裹起来（`call(fn, ...args`）
    - the yield expression `delay(1000)` is evaluated before it gets passed to the caller of `next` (the caller could be the middleware when running our code. It could also be our test code which runs the Generator function and iterates over the returned Generator). So what the caller gets is a Promise
    - the yield expression `call(delay, 1000)` is what gets passed to the caller of `next`. `call` just like `put`, returns an Effect which instructs the middleware to call a given function with the given arguments. In fact, neither `put` nor `call` performs any dispatch or asynchronous call by themselves, they simply return plain JavaScript objects

        ```js
        put({type: 'INCREMENT'}) // => { PUT: {type: 'INCREMENT'} }
        call(delay, 1000)        // => { CALL: {fn: delay, args: [1000]}}
        ```

        - the middleware examines the type of each yielded Effect then decides how to fulfill that Effect. 
        - If the Effect type is a `PUT` then it will dispatch an action to the Store
        - If the Effect is a `CALL` then it'll call the given function
- `Effect` 是指示中间件如何执行的指令，是一个 JS 对象
    - `put` 是一种 Effect（给 reducer），生成一个 dispatch Effect 去通知 Store
    - 中间件收到 Saga `yield` 的 Effect 后会暂停，直到 Effect 完成
    - Effect 生成指令，告诉中间件要做什么
- [ ] new Promise()
---
- `delay` 返回一段时间后 resolve 的 Promise
    - 可用于阻塞生成器
- Sagas 用生成器实现，`yield` 对象给 `redux-saga` 中间件，这些对象可以理解为指令
    - 中间件收到 `yield` 过来的 Promise 时，中间件会让 Saga 暂停，等 Promise 完成
    - Promise 完成后中间件恢复执行 Saga