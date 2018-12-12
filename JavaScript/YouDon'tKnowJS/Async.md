# Asynchrony
- Making synchronous AJAX request locks the browser UI (buttons, menus, scrolling, etc.) and prevents any user interaction whatsoever. It should always be avoided
- There're some browsers and some conditions that `console.log(...)` does not actually immediately output what it's given. 
    - The main reason this may happen is because I/O is a very slow and blocking part of many programs. So it may perform better (from the page/UI perspective) for a browser to handle `console` I/O asynchronously in the background

    ```js
    const a = { index: 1 }
    console.log(a)
    a.index++
    ```

    - If you run into this rare scenario, the best solution is to use breakpoints in the JS debugger instead of relying on `console` output. The next best option would be to force a "snapshot" of the object in question by serializing it to a `string`
- The JS engine doesn't run in isolation. It runs inside a hosting environment
- The JS engine has no sense of time, but has instead been an on-demand execution environment for any arbitrary snippet of JS. It's the **surrounding environment that has always scheduled "events"** (JS code executions) 
  - > When your JS program makes an Ajax request to fetch some data from a server, you set up the "response" code in a function (commonly called a "callback"), and the JS engine tells the hosting environment, "Hey, I'm going to suspend execution for now, but whenever you finish with that network request, and you have some data, please call this function back." The browser is then set up to listen for the response from the network, and when it has something to give you, it schedules the callback function to be executed by inserting it into the event loop
- Each iteration of the event loop is a "tick"
- `setTimeout(...)` doesn't put your callback on the event loop queue. **It set up a timer, when the timer expires, the environment places your callback into the event loop**
  - `setTimeout(() => {}, 0)` - The timer will insert the event at its next opportunity. Two subsequent `setTimeout(() => {}, 0)` calls would not be strictly guaranteed to be
processed in call order
- It's not until ES6 JavaScript that specifies how the event works, which means technically it's within the purview of the JS engine, rather than just the hosting environment
- Async is about the gap between now and later, parallel is about things being able to occur simultaneously
- Run-to-completion behavior - atomic
- There's a new concept layered on top of the event loop queue, called the job queue
  - It's a queue hanging off the end of **every** tick in the event loop queue
  - Later, but as soon as possible
  - Before the next tick
- Processes can cooperate by breaking themselves into smaller chunks and to allow other "process" interleaving
# Callback
- Cons
  - 不直观，代码之间跳来跳去，每个回调的同步、异步会使执行顺序不同
  - 连续的回调链的错误处理等（recovery/retry/forking）不能复用
  - The brittle nature of manually hardcoded callbacks (even with hardcoded error handling) is not graceful. Once you end up **specifying (aka pre-planning) *all* the various eventualities/paths**, the code becomes so convoluted that it's hard to ever maintain or update it
  - Inversion of control: 代码控制权交给第三方库
    - 第三方库可能执行多次调用回调函数等不受控的操作
    - You have to invent an awful lot of ad hoc logic in each and every single callback that's passed to a utility you're not positive you can trust
  - 每个回调都要手写参数校验等校验工作
- Trying to save callbacks
  1. Split callbacks (one for the success, on for the error)
  2. Error-first style (node style)
     - The first argument of a single callback is reserved for an error object (if any)
     - If success, this argument will be empty/falsy and any subsequent arguments will be the success data
     - If an error result is being signaled, the first argument is set/truthy and usually noting else is passed
   - Set up a timeout that cancels the event (address the issue of never being called)

        ```js
        function timeoutify(fn, delay) {
            var intv = setTimeout(function() {
                intv = null
                fn(new Error("Timeout"))
            }, delay)
            return function() {
                // timeout hasn't happened yet
                if (intv) {
                    clearTimeout(intv) 
                    fn.apply(this, arguments)
                }
            }
        }
        ```

- Advice
  - Always invoke callbacks asynchronously, even if that's "right away" on the next turn of the event loop, so that all callbacks are predictably async
  - 同步的回调会使执行结果无法预料
  - Determine whether the API in question will execute async

    ```js
    function asyncify(fn) {
        var orig_fn = fn
        var intv = setTimeout(function() {
            intv = null
            if (fn) fn()
        }, 0)
        fn = null
        return function() {
            // firing too quickly, before intv timer has fired to indicate async turn has passed
            if (inv) {
                fn = orig_fn.bind.apply(
                    orig_fn,
                    // add the wrapper's `this` to the `bind` call parameters,
                    // as well as currying any passed in parameters
                    [this].concat([].slice.call(arguments))
                )
            }
            // already async 
            else {
                // invoke the original function
                orig_fn.apply(this, arguments)
            }
        }
    }
    function result(data) {
        console.log(a);
    }
    var a = 0;
    ajax( "..pre-cached-url..", asyncify(result) );
    a++;
    ```

    - Whether the AJAX request is in the cache and resolves to call the callback right away, or must be fetched over the wire and thus complete later asynchronously, this code will always output `1`. `result()` cannot help but be invoked asynchronously