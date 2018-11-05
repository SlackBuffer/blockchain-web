# Execution contexts and lexical environments
- Lexical environment
    - Where it's written, what surrounds it
    - In programming languages where the lexical environment is important, where you see things written gives you an idea of where it'll actually sit in the computer's memory and how it will interact with other variables, functions and elements of the program
- Execution context
    - manages the lexical environment that is currently running
- JS code runs inside an execution context, a wrapper that the JS engine creates
- Base execution context (global) creates two things for you
    1. global object
    2. `this`
- What's executed isn't what you've written, it's been translated by the JavaScript engine
- Hoisting
    - In the execution context creation phase, the engine setups memory space for variables and functions before your code is executed
        - For variables, the value is initially set to the placeholder **value** `undefined`
        - For functions, they are sitting in memory in their **entirety**
- **Single threaded**
    - JS isn't the only thing that happens in the browser
    - Just JS behaves in the single threaded manner
- **Synchronous** execution
- Execution stack
    - Whichever execution context on top is the one that's currently running
    - Any a function is invoked (including self-invoke), a new execution context is created and put on the execution stack
- Every execution context has its own a reference to its **outer environment**
    - If JS engine cannot find a variable in the current execution context (inside a function), it will look at the outer environment for that variable
    - The outer environment is determined by the **lexical environment** of that function
- Scope chain

    ```js
    function b() { var myVar; console.log(myVar) }
    function a() { var myVar = 2; console.log(myVar); b(); }
    var myVar = 1; console.log(myVar);
    a(); console.log(myVar);    // 1 2 undefined 1

    // where I got wrong
    function b() { console.log(myVar) } // b sits lexically at the global level
    function a() { var myVar = 2; b(); }
    var myVar = 1;
    a();    // 1
    ```

- `let` declaration in a `for` loop
    - Each loop you get a different variable in memory
    - <mark>[ ] 不是在同一个地址上操作值，开辟新地址并将值拷贝过去</mark>
- The browser is asynchronous
    - JS engine itself is synchronous
    - Rendering engine
    - HTTP request
- The event queue gets looked at **periodically** by the JS engine when **the execution stack is empty**
    - It's not really asynchronous
    - The browser **asynchronously** puts things into the event queue
        - If there's a handler (function) for that event, JS engine creates its execution context and processes it. Then next event in the queue move up
    - The JS code that's running is still asynchronous
    - Any event that happens **outside** the JS engine gets placed in that queue
# Types and operators
- Variables can hold different types of values because it's all figured out during execution
- Let `undefined` mean a variable is never set a value (initialized)
    - Leave `undefined` for the JS engine, use `null` to represent lack of existence
- There's only one numeric type in JavaScript under the hood: floating type
- <mark>[ ] symbol</mark>
    - Also a primitive type
- **Operators**
    - A special type **function** that is syntactically (written) differently
        - JS engine define the function for you
    - Operators generally take two parameters and return a value

    ```js
    function +(a, b) {
        // add the two
    }
    +(3, 4) // annoying
    a + 3 // infix notation
    ```

    - ***Infix notation*** is essentially a function call
- [Associativity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Associativity)
    - What order operator functions (with the same precedence) get called in: left-to-right (the operator furthest on the left will be called first) or right-to-left
    - > [Operator precedence and associativity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)
- Assignment
    - The assignment operation evaluates to the assigned value
    - Chaining the assignment operator is possible in order to assign a single value to multiple variables
- Coercion
    - The operator (function defined by the engine) does the coercion under the hood

    ```js
    // weird
    Number(null)        // 0
    Number(undefined)   // NaN
    null == 0           // false
    null < 1            // true
    null < -1           // false
    ```

    - > [<u>Equality comparisons and sameness</u>
](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- Default values
    - `||` returns the value that can be coerced to `true`