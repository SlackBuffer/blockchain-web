- When a Web Socket is created in JS, an HTTP request is sent to the server to initiate a connection. When server responds, the connection uses HTTP upgrade to switch from HTTP to the Web Socket protocol
    - This means that the Web Sockets cannot be implemented with a standard HTTP server and must use a specialized server supporting the protocol to work properly
- URL scheme: `ws://`, `wss://`
- The advantage of using a custom protocol over HTTP is that very small amounts of data,  unencumbered by the byte overhead of HTTP, can be sent between the client and the server
    - Using smaller data packets makes Web Sockets ideal for mobile applications where bandwidth and latency are a problem
- The disadvantage of using a custom protocol is that it has taken longer to define protocol than the JavaScript API
- Must pass in an absolute URL to the `WebSocket` constructor
    - `var socket = new WebSocket("ws://www.hofungkoeng.com")`
- The same-origin policy does not apply to Web Sockets, you can open a connection to any site. It's completely up to the server whether or not it will communicate with a page from a particular origin (It can determine from where the request originated using information in the handshake)
- Similar to XHR, `WebSocket` has a `readyState` property that indicates the current state
    1. `WebSocket.OPENING` (0) - The connection is being established
    2. `WebSocket.OPEN` (1) - The connection has been established
    3. `WebSocket.CLOSING` (2) - The connection is beginning to close
    4. `WebSocket.CLOSE` (3) - The connection is closed
    - The `readyState` always starts at 0
- You can close a Web Socket connection at any time using the `close()` method. Upon calling `close()`, the `readyState` immediately change to 2 and will transition to 3 when complete
- To send data to the server, use the `send()` method and pass in any **string**
    - Web Sockets can only send plain text over the connection
- When the server sends a message to the client, a `message` event is fired on the `WebSocket` object. The payload is available through the `event.data` property

    ```js
    socket.onmessage = function(event) {
        var data = event.data
    }
    ```

    - Data returned in `event.data` is always a string
- `open` event fires when the connection has been successfully made; `error` event fires when an error occurs, the connection is unable to persist; `close` event fires when the connection is closed
- The `WebSocket` object doesn't support DOM level 2 event listeners, so you need to use DOM level 0 style event handlers for each
    - `socket.onopen = () => {}`, `socket.onerror = () => {}`, `socket.onclose = () => {]`
    - Of the 3 events, only the `close` event has additional information on the `event` object
        1. Boolean `wasClean` indicating if the connection was closed cleanly
        2. A numeric status code `code` sent from the server
        3. A string `reason` containing message sent from the server