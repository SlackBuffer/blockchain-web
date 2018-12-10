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
- `setTimeout(...)` doesn't put your callback on the event loop queue. **It set up a timer, when the timer expires, the environment places your callback into the event loop**
- It's not until ES6 JavaScript that specifies how the event works, which means technically it's within the purview of the JS engine, rather than just the hosting environment