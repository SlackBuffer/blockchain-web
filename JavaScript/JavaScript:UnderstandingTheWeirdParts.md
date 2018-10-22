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
    - Whichever execution context is on top is the one that's currently running
    - Any a function is invoked (including self-invoke), a new execution context is created and put on the execution stack