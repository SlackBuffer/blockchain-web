<!-- - > https://eloquentjavascript.net/11_async.html#p_vzmLB4UIgA
- A thread is another running program whose execution may be interleaved with other programs by the operating system—since most modern computers contain multiple processors, multiple threads may even run at the same time, on different processors
- In a way, asynchronicity is contagious. Any function that calls a function that works asynchronously must itself be asynchronous, using a callback or similar mechanism to deliver its result
# Promises
- An asynchronous action that may complete at some point and produce a value. Able to notify anyone who is interested when its value is available
- The easiest way to create a promise is by calling `Promise.resolve`. This function ensures that the **value** you give it is **wrapped in a promise**
    - If it’s already a promise, it is simply returned—otherwise, you get a new promise that immediately finishes with your value as its result
    - Use `then` method to get the result of a promise
        - This registers a callback function to be called when the promise resolves and produces a value
        - You can add multiple callbacks to a single promise, and they will be called, even if you add them after the promise has already resolved (finished)
        - `then` returns another promise, which resolves to the value that the handler function returns or, if that returns a promise, waits for that promise and then resolves to its result
    - A normal value is simply there. A promised value is a value that might already be there or might appear at some point in the future. Computations defined in terms of promises act on such wrapped values and are executed asynchronously as the values become available
- `Promise` constructor expects a function as argument, which it immediately calls, passing it a function that it can use to resolve the promise
    - It works this way, instead of for example with a `resolve` method, so that only the code that created the promise can resolve it
- `Promise.reject` creates a new, immediately rejected promise
- `catch`
---

 -->

# Lifecycle
    1. Page building
    2. Event handling
## 1. Page-building phase
- The page-building phase starts when the browser receives the code of the page. It’s performed in two steps
    1. Parsing the HTML and building the DOM
    2. Executing JavaScript code - **whenever `<script>` element is encountered**
- During the page-building phase, the browser can **switch** between these two steps as many times as necessary
### Parsing the HTML and building the DOM
- The page-building phase starts with the browser receiving the HTML code
- The browser does this by parsing the HTML code, **one HTML element at a time**
- Although the HTML and the DOM are closely linked, they aren’t one and the same
    - Think of the HTML code as a blueprint the browser follows when constructing the initial DOM—the UI—of the page
    - The browser can even fix problems that it finds with this blueprint in order to create a valid DOM
- During page construction, when the browser encounters `<script>` element, it **pauses the DOM construction** from HTML code and starts executing JavaScript code
### Executing JavaScript code
- All JavaScript code contained in the script element is executed by the browser’s JavaScript engine
- <mark/>The browser provides an API through **a global object** that can be used by the **JavaScript engine** to interact with and modify the page</mark>
- The primary global object that the browser exposes to the JavaScript engine is the `window` object, which represents the window in which a page is contained
    - The `window` object is the global object **through** which all other global objects, global variables (even user-defined ones), and browser APIs are accessible
    - One of the most important properties of the global `window` object is the `document`, which represents the **DOM of the current page**
#### Different types of JavaScript code
- The code contained in a function is called *function code*, whereas the code placed outside all functions is called *global code*
- Global code is executed automatically by the JavaScript engine in a straightforward fashion, line by line, as it’s encountered
- Function code, in order to be executed, has to be called by something else: either by global code, by some other function, or by the **browser**
#### Executing JavaScript code in the page-building phase
- When the browser reaches the `script` node in the page-building phase, it pauses the DOM construction based on HTML code and starts executing JavaScript code instead
- JavaScript code cannot select and modify elements that haven’t yet been created (**haven't constructed into DOM by the browser yet**), can only modify current DOM
- Once the JavaScript engine executes the last line of JavaScript code in the `script` element, the browser exits the JavaScript execution mode and continues building DOM nodes by processing the remaining HTML code
- The global state of the JavaScript application **persists** in the meantime. All user-defined global variables created during the execution of JavaScript code in one script element are normally accessible to JavaScript code in other script elements
    - This happens because the global `window` object, which stores all global JavaScript variables, is alive and accessible during the entire lifecycle of the page
## 2. Event handling
- The browser execution environment is, at its core, based on the idea that only a single piece of code can be executed at once: the so-called single-threaded execution model
- Whenever an event occurs, the browser should execute the associated event-handler function. But there’s no guarantee that we have extremely patient users who will always wait an appropriate amount of time before triggering another event. For this reason, the browser needs a way to keep track of the events that have occurred but have yet to be processed
- The browser uses an ***event queue***
- All generated events (it doesn’t matter if they’re user-generated, like mouse moves or key presses, or server-generated, such as Ajax events) are placed in the same event queue, **in the order in which they’re detected by the browser**
- Only one event is handled at a time; writing event handlers that take a lot of time to execute leads to unresponsive web applications
- The browser mechanism that puts events onto the queue is **external** to the page-building and event-handling phases. The processing that’s necessary to determine when events have occurred and that pushes them onto the event queue doesn’t participate in the thread that’s handling the events
# Functions for the future
- Generators are a special type of function
    - Generators **produce multiple values**, on a per request basis, while **suspending** their execution between these requests
- A promise is a **placeholder** for a value that we don’t have yet but will at some later point
    - Especially good for working with multiple asynchronous steps
## Generators
- A generator is a function that generates a sequence of values, but **not all at once**, as a standard function would, but **on a per request basis**
    - We have to **explicitly** ask the generator for a new value, and the generator will either respond with a value or notify us that it has no more values to produce
- After a value is produced, a generator function doesn’t end its execution, as a normal function would. Instead, a generator is merely **suspended**. Then, when a request for another value comes along, the generator ***resumes where it left off***
- Within generator functions, use `yield` to produce individual values
- Consuming generator values
    1. `for-of`
- **Calling a generator doesn’t execute the generator function**; instead it creates an **object** called an `iterator`, an object through which we can communicate with the generator
### Controlling the generator through the iterator object
- Iterator object exposes is the `next` method, which we can use to control the generator by requesting a value from it
    - As a response to that call, the generator executes its code until it reaches a `yield` keyword that produces an intermediary result (one item in the generated sequence of items), and **returns a new object** that encapsulates that result (`value`) and signals whether the generator has more values to produce (`done`)
        - Last `yield` expression's `done` is still `false`
        - n `yield` expressions plus (n+1) `next()` expression equals (n+1) iterator objects 
    - As soon as the current value is produced, the generator **suspends its execution without blocking** and patiently **waits for another value request**
#### Iterating the iterator
- `for-of` is syntactic sugar for iterating over iterators
  
    ```js
    function* WeaponGenerator() {
        yield 'katana'
        yield 'wakizashi'
    }
    const weaponsIterator = WeaponGenerator()

    let item
    while (!(item = weaponsIterator.next()).done) {
        console.log(item.value)
    }

    for(let item of WeaponGenerator()) {
        console.log(item)
    }
    ```

#### Yielding to another generator
- Using `yield*` to delegate to another generator
- By using the `yield*` operator **on an iterator**, we yield to another generator

    ```js
    function* WarriorGenerator(){
        yield "Sun Tzu"
        yield* NinjaGenerator()
        yield "Genghis Khan"
    }
    function* NinjaGenerator(){
        yield "Hattori"
        yield "Yoshi"
    }
    for(let warrior of WarriorGenerator()){
        console.log(warrior) // Sun Tzu, Hattori, Yoshi, Genghis Khan
    }
    ```

    - From a `WarriorGenerator` we’re yielding to a new `NinjaGenerator`
    - All calls to the current `WarriorGenerator` iterator’s `next` method are rerouted to the `NinjaGenerator`
    - This holds until the `NinjaGenerator` has no work left to do
    - Only when the `NinjaGenerator` is done with its work will the execution of the original iterator continue
    - This is happening transparently to the code that calls the original generator. The `for-of` loop **doesn’t care** that the `WarriorGenerator` yields to another generator; it keeps calling `next` until it’s done
### Using generators
#### Using generators to generate IDs

```js
// No messy global variables whose value can be accidentally changed
function *IdGenerator(){
    let id = 0 // id can’t be modified from outside our generator
    while(true){
        yield ++id
    }
}

const idIterator = IdGenerator()
const ninja1 = { id: idIterator.next().value }
const ninja2 = { id: idIterator.next().value }
const ninja3 = { id: idIterator.next().value }
```

#### Using generators to traverse the DOM

```js
// recursive
function traverseDOM(element, callback) {
    callback(element) // Processes the current node with a callback
    element = element.firstElementChild // returns the object's first child Element
    while (element) {
        traverseDOM(element, callback)
        element = element.nextElementSibling // returns the element immediately following the specified one in its parent's children list
    }
}
const subTree = document.getElementById("subTree")
traverseDOM(subTree, function(element) {
    // manipulate the element
})

// use iterator
function* DomTraversal(element) {
    yield element
    element = element.firstElementChild
    while (element) {
        yield* DomTraversal(element)
        element = element.nextElementSibling
    }
}
const subTree = document.getElementById("subTree")
for (let element of DomTraversal(subTree)) {
    // manipulate the element
}
```

- Instead of processing the subtree of each visited node by **recursing another level**, we **create one generator function for each visited node and yield to it**
    - This enables us to write what’s conceptually recursive code in iterable fashion
    - The benefit is that we can consume the generated sequence of nodes with a simple `for-of` loop, without resorting to nasty callbacks
### Communicating with a generator
#### Sending values as generator arguments & Using the `next` to send values into a container

```js
function* NinjaGenerator(action) {
    const imposter = yield ("Hattori " + action)
    yield ("Yoshi (" + imposter + ") " + action)
}
const ninjaIterator = NinjaGenerator("skulk")
const result1 = ninjaIterator.next()
console.log(result1.value) // Hattori skulk
const result2 = ninjaIterator.next("Hanzo")
console.log(result2.value) // Yoshi (Hanzo) skulk
```

- This `next`-passed-in value is used by the generator as the value of the whole `yield` expression, **in which (expression)** the generator was currently suspended
    - The `next` method supplies the value to the ***waiting* `yield` expression**, so if there’s no `yield` expression waiting, there’s nothing to supply the value to
    - For this reason, we **can’t** supply values over the first call to the `next` method
    - If you need to supply an initial value to the generator, you can do so when calling the generator itself
#### Throwing exceptions
- There’s another, slightly less orthodox, way to supply a value to a generator: by throwing an exception
- Each iterator, in addition to having a `next` method, has a `throw` method that we can use to throw an exception back to the generator

    ```js
    function* NinjaGenerator() {
        try{
            yield "Hattori"
            fail("The expected exception didn't occur") // this fail shouldn’t be reached
        }
        catch(e){
            console.log(e) // catch this
        }
    }
    const ninjaIterator = NinjaGenerator()
    const result1 = ninjaIterator.next()
    console.log(result1.value) // Hattori
    ninjaIterator.throw("Catch this!")
    ```

### Exploring generators under the hood
- In a way, a generator works almost like a small program, a **state machine** that moves between states
    - Suspended start
        - When the generator is created, it starts in this state
        - None of the generator’s code is executed
    - Executing 
        - The state in which the code of the generator is executed
        - The execution continues either from the beginning or from where the generator was last suspended
        - A generator moves to this state when the matching iterator’s `next` method is called, and there exists code to be executed
    - Suspended yield
        - During execution, when a generator reaches a `yield` expression, it creates a new object carrying the return value, yields it, and suspends its execution
        - This is the state in which the generator is paused and is waiting to continue its execution
    - Completed
        - If during execution the generator either runs into a **`return`** statement or **runs out of code to execute**, the generator moves into this state
#### Tracking generators with execution contexts

```js
function* NinjaGenerator(action) {
    yield "Hattori " + action
    return "Yoshi " + action
}
const ninjaIterator = NinjaGenerator("skulk")
const result1 = ninjaIterator.next()
const result2 = ninjaIterator.next()
console.log(result1.value, result2.value) // Hattori skulk Yoshi skulk
```

- Analysis
    1. Before calling the `NinjaGenerator` function
        - Because we’re executing global code, the **execution context stack** contains only the **global execution context**, which **references the global environment in which our identifiers are kept**
        - Only the `NinjaGenerator` identifier references a function, while the values of all other identifiers are `undefined`
    2. Make the call to the `NinjaGenerator` function
        - A new `NinjaGenerator` execution context item is created alongside the **matching lexical environment** and pushed onto the stack
        - Generators are special, none of the function code is executed
        - Instead, a new iterator, which we’ll refer to in the code as `ninjaIterator`, is created and returned
        - Because the iterator is used to control the execution of the generator, **the iterator gets a reference to the *execution context*** in which it was created
            - Is the reason of the ability to resume from suspension
        - Typically, when program execution returns from a standard function, the matching execution context is popped from the stack and completely discarded. But this isn’t the case with generators
            - The matching `NinjaGenerator` stack item is popped from the stack, but it’s not discarded, because the `ninjaIterator` keeps a reference to it
            - Can see it as an analogue to closures
            - Because the execution of all functions is handled by execution contexts, the iterator **keeps** a reference to its execution context, so that it’s alive for as long as the iterator needs it
        - When the `next` is called
            - If this was a standard straightforward function call, this would cause the creation of a new `next`()` execution context item, which would be placed on the stack
            - But actually it <mark>**reactivates the matching execution context (still referenced by the iterator object)**</mark>, in this case, the `NinjaGenerator` context, and places it on top of the stack, continuing the execution where it left off
            - `yield "Hattori " + action` (first `next()`)
                - The generator determines that the expression equals `Hattori skulk`, and the evaluation reaches the `yield` keyword
                - This means that `Hattori skulk` is the **first intermediary result** of our generator and that we want to **suspend** the execution of the generator and **return** that value
                - Again, the `NinjaGenerator` context is taken off the stack, but it’s not completely discarded, because `ninjaIterator` keeps a reference to it
                - The generator is now suspended, and has moved to the Suspended Yield state, without blocking
                - The program execution resumes in global code, by storing the yielded value to `result1`
            - Second `next()`
                - Encounters a `return` statement
                - This returns the value `Yoshi skulk` and completes the generator’s execution by moving the generator into the Completed state
## Promises
- A promise is a placeholder for a value that we don’t have now but will have later; it’s a guarantee that we’ll eventually know the result of an asynchronous computation
- To create a promise, we use the new, built-in `Promise` constructor, to which we pass a function called an *executor function*
    - It has two parameters: `resolve` and `reject`
    - The executor is <mark>***called immediately***</mark> when constructing the `Promise` object with two built-in functions as arguments: `resolve`, which we **manually call** if we want the promise to `resolve` successfully, and `reject`, which we call if an error occurs
- The built-in then method on the `Promise` object accept two callback functions: a success callback and a failure callback
    - The former is called if the promise is resolved successfully (if the `resolve` function is called on the promise)
    - The latter is called if there’s a problem (either an unhandled exception occurs or the `reject` function is called on a promise)
### Understanding the problems with simple callbacks
- Naturally, during this long-running task, errors can happen. And the problem with callbacks is that you can’t use built-in language constructs, such as `try-catch` statements, in the following way

    ```js
    try {
        getJSON("data/ninjas.json", function() {
        //Handle results
        });
    } catch(e) {/*Handle errors*/}
    ```

    - [ ](details later) This happens because the **code invoking the callback** usually isn’t executed in the same **step of the event loop** as the **code that starts the long-running task**. As a consequence, **errors usually get lost**
    - Many libraries, therefore, define their own conventions for reporting errors
        - In the Node.js world, callbacks customarily take two arguments, `err` and `data`, where `err` will be a non-null value if an error occurs somewhere along the way
    - This leads to the first problem with callbacks: ***difficult error handling***
    - A similar thing holds with loops: If you want to perform asynchronous actions for each item in a collection, you have to jump through some more hoops to get it done
- Nested callbacks
    - Pyramid of doom
    - This leads us to the second problem with callbacks: performing **sequences of steps** is tricky
- Sometimes, the steps that we have to go through to get to the final result don’t depend on each other, so we don’t have to make them in sequence. Instead, to save precious milliseconds, we can do them in parallel
    - Because we don’t know the order in which the data is received, every time we get some data, we have to **check** whether it’s the last piece of the puzzle that we’re missing
    - Notice that we have to write a lot of boilerplate code just to do something as common as executing a number of actions in parallel
    - This leads us to the third problem with callbacks: performing a number of steps **in parallel** is also tricky
### Diving into promises
- During its lifetime, a promise can go through a couple of states
    - A promise starts in the *pending state*, in which we know nothing about our promised value. A promise in the pending state is also called an *unresolved promise*
        - An unresolved promise is waiting asynchronous (or synchronous) task to resolve it
    - During program execution, if the promise’s `resolve` function is called, the promise moves into the *fulfilled state*, in which we’ve successfully obtained the promised value
    - If the promise’s `reject` function is called, or if an unhandled exception occurs during promise handling, the promise moves into the *rejected state*, in which we weren’t able to obtain the promised value, but in which we at least know why
    - Once a promise has reached either the fulfilled state or the rejected state, it **can’t switch** (a promise can’t go from fulfilled to rejected or vice versa), and it always stays in that state. We call that promise a *resolved promise* (either successfully or not)

    ```js
    console.log("At code start")
    var ninjaDelayedPromise = new Promise((resolve, reject) => {
        console.log("ninjaDelayedPromise executor")
        setTimeout(() => {
            console.log("Resolving ninjaDelayedPromise")
            resolve("Hattori")
        }, 500) // could be any asynchronous action
    })
    console.log( "After creating ninjaDelayedPromise")
    ninjaDelayedPromise.then(ninja => {
        console.log("ninjaDelayedPromise resolve handled with Hattori")
    })

    const ninjaImmediatePromise = new Promise((resolve, reject) => {
        console.log("ninjaImmediatePromise executor. Immediate resolve.")
        resolve("Yoshi")
    })
    ninjaImmediatePromise.then(ninja => {
        console.log("ninjaImmediatePromise resolve handled with Yoshi")
    })
    console.log("At code end")
    // At code start
    // ninjaDelayedPromise executor
    // After creating ninjaDelayedPromise
    // ninjaImmediatePromise executor. Immediate resolve.
    // At code end
    // ninjaImmediatePromise resolve handled with Yoshi
    // Resolving ninjaDelayedPromise
    // ninjaDelayedPromise resolve handled with Hattori
    ```

    - The callback scheduled in `then` will **always be called asynchronously**, regardless of the current state of the promise
    - After construction, the `ninjaDelayedPromise` is in the first promise state, **pending**
    - The `ninjaImmediatePromise` **finishes construction in the resolved state**, and the promise **already has the value `Yoshi`**
- Promises are designed to deal with asynchronous actions, so the JavaScript engine **always resorts to asynchronous handling**, to make the promise behavior **predictable**
    - [ ](details later) The engine does this by executing the then callbacks after all the code in the current step of the event loop is executed
### Rejecting promises
- Two ways of rejecting a promise
    1. Explicitly, by calling the passed-in `reject` method in the executor function of a promise
    2. Implicitly, if during the handling of a promise, an unhandled exception occurs
- Explicitly
    - Explicitly reject a promise, by calling the passed-in `reject` inside promise
    - If a promise is rejected, when registering callbacks through the then `method`, the second, `error`, callback will always be invoked. Or use the built-in `catch` method (chain `catch` after `then`)
- Implicitly
    - A promise can also be rejected implicitly, if an exception occurs during its processing (`undeclaredVariable++`)
### Creating a real-world promise

```js
function getJSON(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest() // Creates and returns a new promise
        request.open("GET", url)
        request.onload = function() {
            try {
                if (this.status === 200) {
                    resolve(JSON.parse(this.response))
                } else {
                    reject(this.status + " " + this.statusText)
                }
            } catch(e) {
                reject(e.message)
            }
        }
        request.onerror = function() {
            reject(this.status + " " + this.statusText)
        }
        request.send()
    })
}
getJSON（"data/ninjas.json").then(ninjas => {
    assert(ninjas !== null, "Ninjas obtained!")
}).catch(e => console.log("Shouldn't be here"))
```

- The `onload` event is triggered when the browser receives a response from the server, and `onerror` is triggered when an error in communication happens
- These event handlers will be called asynchronously **by the browser**, as they occur
- JSON code could always have syntax errors. This is why, when the `JSON.parse` method is put in `try-catch` statement. If an exception occurs while parsing the server response, we also reject the promise
### Chaining promises
- Calling the `then` method also returns a new promise
- There’s nothing stopping us from chaining as many `then` methods as we want
#### Catching errors in chained promises
- When dealing with sequences of asynchronous steps, an error can occur in any step
- When we care about only **the success/failure of the entire sequence of steps**, supplying each step with special error handling might be tedious. Use `...catch(error => console.log("An error has occurred"))`
    - If a failure occurs in any of the previous promises, the `catch` method catches it
    - If no error occurs, the program flow continues through it, unobstructed
### Waiting for a number of promises
- The `Promise.all` method takes an array of promises, and **creates a new promise** that succeeds if all promises succeed, and fails if even one promise fails

    ```js
    Promise.all([getJSON("data/ninjas.json"),
                 getJSON("data/mapInfo.json"),
                 getJSON("data/plan.json")]).then(results => {
        const ninjas = results[0], mapInfo = results[1], plan = results[2]
        assert(ninjas !== undefined && mapInfo !== undefined && plan !== undefined, "The plan is ready to be set in motion!")})
            .catch(error => {
                console.log("A problem in carrying out our plan!")
            })
    ```

    - The succeed callback receives an array of succeed values, one for each of the passed-in promises, in order
#### `Promise.race`
- `Promise.race` method to take an array of promises and return a completely new promise that resolves or rejects as soon as the first of the promises resolves or rejects
    - No need for manually tracking everything

    ```js
    Promise.race([getJSON("data/yoshi.json"),
                  getJSON("data/hattori.json"),
                  getJSON("data/hanzo.json")])
            .then(ninja => {
                assert(ninja !== null, ninja.name + " responded first")})
            .catch(error => console.log("Failure!"))
    ```

### Combining generators and promises

```js
try {
    const ninjas = syncGetJSON("data/ninjas.json")
    const missions = syncGetJSON(ninjas[0].missionsUrl)
    const missionDetails = syncGetJSON(missions[0].detailsUrl)
    // Study the mission description
} catch(e){
    // Oh no, we weren't able to get the mission details
}
```

- Yielding from a generator suspends the execution of the generator without blocking. Use generator’s iterator's `next` method to wake up (resume) the generator
- Promises allow us to specify a callback that will be triggered in case we were able to obtain the promised value, and a callback that will be triggered in case an error has occurred
- Combining
    - Put the code that use asynchronous tasks in a generator and execute that generator function
    - When we reach a point in the generator execution that calls an asynchronous task, we create a promise that represents the value of that asynchronous task
    - Because we have no idea when that promise will be resolved (or even if it will be resolved), at this point of generator execution, we yield from the generator, so that we don’t cause blocking
    - After a while, when the promise gets settled, we continue the execution of our generator by calling the iterator’s `next` method. We do this as many times as necessary

    ```js
    // long-running, mutually independent, sequential, subtasks
    async(function*() { // invokes async here
        try {
            // getJSON creates a promise // "creating a real-world promise" demo
            const ninjas = yield getJSON('data/ninjas.json')
            const missions = yield getJSON(ninjas[0].missionUrl)
            const missionDescription = yield getJSON(missions[0].detailUrl)
            // study the mission details
        } catch (e) {
            // Oh no, we weren't able to get the mission details
        }
    })
    function async(generator) {
        var iterator = generator()
        function handle(iteratorResult) {
            if (iteratorResult.done) { return }
            const iteratorValue = iteratorResult.value
            if (iteratorValue instanceOf Promise) {
                iteratorValue.then(res => handle(iterator.next(res))
                             .catch(err => iterator.throw(err)) // pass err to the generator
            }
        }
        try {
            handle(iterator.next())
        } catch (e) {
            iterator.throw(e) // pass err to the generator
        }
    }
    ```

- Compare

    ```js
    // ugly
    getJSON("data/ninjas.json", (err, ninjas) => {
        if (err) { console.log("Error fetching ninjas", err); return }
        getJSON(ninjas[0].missionsUrl, (err, missions) => {
            if(err) { console.log("Error locating ninja missions", err); return }
            console.log(missions)
        })
    })
    // elegant
    async(function*() {
    try {
        const ninjas = yield getJSON("data/ninjas.json")
        const missions = yield getJSON(ninjas[0].missionsUrl)
            // All information received
        }
        catch(e) {
            // An error has occurred
        }
    })
    ```

### Looking forward—the async function
- The built-in `async`, `await` take care of the boilerplate code (developing an `async` function on our own)
    - These two combine generators and promises for us

    ```js
    (async function() {
        try {
            const ninjas = await getJSON('data/ninjas.json')
            const missions = await getJSON(mission[0].missionUrl)
            console.log(missions)
        } catch(e) {
            console.log("Error: ", e)
        }
    })()
    ```

    - Use the `async` keyword in front of the function keyword to specify that this function **relies on asynchronous values**
    - At every place where we call an asynchronous task, we place the `await` keyword that says to the JavaScript engine, please **wait** for this result **without blocking**
# Surviving events
## Diving into the event loop
- The event loop has **at least two queues** that, in addition to **events**, hold **other actions performed by the browser**
- These actions are called tasks and are grouped into **two categories**: *macrotasks* (or often just called tasks) and *microtasks*
- Macrotasks
    - From the browser’s perspective, a macrotask represents **one discrete, self-contained unit of work**
    - After running a task, the browser can continue with other assignments such as re-rendering the UI of the page, or performing garbage collection
    - Examples include creating the main document object, parsing HTML, <mark>**executing mainline (global) JavaScript code**</mark>, changing the current URL, as well as various <mark>**events**</mark> such as page loading, input, network events, and **timer events**
- Microtasks
    - Smaller tasks that **update the application state** and should be executed **before** the browser continues with other assignments such as re-rendering the UI
    - <mark>Should be executed as soon as possible, in an **asynchronous** way, but **without the cost of executing a whole new macrotask**</mark>
    - Microtasks **enable us to execute certain actions before the UI is re-rendered**, thereby **avoiding unnecessary UI rendering that might show inconsistent application state**
    - Examples include **promise callbacks** and DOM mutation changes
- > The event loop is detailed in the [HTML specification](https://html.spec.whatwg.org/#event-loops), which also discusses the concept of macrotasks and microtasks. [ECMAScript specification](http://ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues) mentions ***jobs*** (which are analogous to microtasks) in respect to handling promise callbacks. Even though the event loop is defined in the HTML specification, other environments, such as Node.js, also use it
- The implementation of an event loop should use at least one queue for macrotasks and at least one queue for microtasks
- Event loop implementations usually go beyond that, and have several queues for different types of macro- and microtasks
    - This enables the event loop to prioritize types of tasks
        - For example, giving **priority** to performance-sensitive tasks such as user input
    - On the other hand, because there are many browsers and JavaScript execution environments out in the wild, you shouldn’t be surprised if you run into event loops with only a single queue for both types of tasks together
- The event loop is based on **two fundamental principles**
    1. Tasks (Both types) are handled one at a time.
    1. A task runs to completion and can’t be interrupted by another task
- The event loop usually has access to at least two task queues: a microtask queue and a macrotask queue
    - **Both types of tasks are handled one at a time**
- High-level understanding of a single iteration
    - In a single loop iteration, **one macrotask at most is processed** (**others are left waiting in the queue**), whereas **all microtasks are processed**
        1. The event loop **first checks the macrotask queue**, and if there’s a macrotask waiting to be executed, starts its execution
        2. Only after **the** macrotask is fully processed (or if there were no tasks in the queue), the event loop moves onto processing the microtask queue
            - If there’s a task waiting in that microtask queue, the event loop takes it and executes it **to completion**. This is performed for **all microtasks in the queue**
    - When the microtask queue is finally empty, the event loop checks **whether a UI render update is required**, and if it is, the UI is re-rendered
    - This **ends the current iteration of the event loop**, which goes back to the beginning and checks the macrotask queue again
- Details
    - The act of adding tasks to their matching queues happens **outside** the event loop
        - <mark>The acts of **detecting and adding** tasks are done **separately** from the event loop</mark>
        - If this wasn’t the case, any events that occur while JavaScript code is being executed would be ignored
    - Both types of tasks are executed one at a time
        - Because JavaScript is based on a **single-threaded execution model**
        - <mark>When a task starts executing, it’s **executed to its completion, without being interrupted by another task**</mark>
        - Only the browser can stop the execution of a task; for example, if the task starts being too selfish by taking up too much time or memory
    - All microtasks should be executed before the next rendering
        - Because their **goal** is to **update the application state before rendering occurs**
    - **The browser usually tries to render the page 60 times per second**, to achieve 60 frames per second (60 fps, a frame rate that’s often considered ideal for smooth motion, such as animations)
        - Meaning, the browser tries to render a frame every 16 ms
        - <mark>The "update rendering" action happens **inside the event loop**</mark>, because the page content shouldn’t be modified by another task while the page is being rendered
        - Meaning, if we want to achieve smooth-running applications, we don’t have much time to process tasks in a single event-loop iteration
        - A single task and all microtasks generated by that task should ideally complete **within 16 ms**
- Updating the UI is a complex operation, if there isn’t an explicit need to render the page, the browser may choose not to perform the UI rendering in this loop iteration
- > The browser shows the dreaded “Unresponsive script” message if a task gets executed for way too long (more than a couple seconds)
- Be careful about which events you decide to handle, how often they occur, and how much processing time an event handler takes
    - For example, you should be extra careful when handling **`mouse-move`** events. Moving the mouse around causes a large number of events to be queued, so performing any complex operation in that mouse-move handler is a sure path to building a slow and jerky web application
### An example with only macrotasks

```html
<script>
    const firstButton = document.getElementById("firstButton")
    const secondButton = document.getElementById("secondButton")
    firstButton.addEventListener("click", function firstHandler(){
        /* Click handle code that runs for 8ms */
    })
    secondButton.addEventListener("click", function secondHandler(){
        /* Click handle code that runs for 5ms */
    })
    /* Mainline(global) JavaScript code takes 15 ms to execute */
</script>
```

- We have a super quick user who clicks the first button 5 ms after our script starts executing, and the second button 12 ms after
    1. Macrotask queue @ 0 ms
        - The first task is to evaluate mainline JS code (currently executing task)
    2. Macrotask queue @ 5 ms
        - The click event on `firstButton` is added to the queue, without interrupting mainline code execution
    3. Macrotask queue @ 12 ms
        - The click event on `secondButton` is added to the queue, without interrupting mainline code execution
    4. Macrotask queue @ 15 ms
        - Mainline code is done executing
        - Take the task off the queue
            - > Doesn’t have any microtasks in this case. Move on to updating the UI
            - > In this example, even though the update happens and takes some time, for simplicity sake, we keep it out of our discussion
        - Move on to the next task: handle `firstButton` click
    5. Macrotask queue @ 23 ms
        - `firstButton` click handler is done executing
        - Take the task off the queue
            - > Again, the browser checks the microtask queue, which is still empty, and re-renders the page, if necessary
            - [ ] 两次 render 的间隔少于 16ms 是可以的，不是说浏览器 re-render 的最短间隔是 16ms?
        - Move on to the next task: handle `secondButton` click
    6. Macrotask queue @ 28 ms
        - `secondButton` click handler is done executing
        - Take the task off the queue
        - The task queue is now empty
### An example with both macro- and microtasks

```html
<script>
    const firstButton = document.getElementById("firstButton")
    const secondButton = document.getElementById("secondButton")
    firstButton.addEventListener("click", function firstHandler(){
        // an immediately resolved promise
        Promise.resolve().then(() => {
            /* Some promise handling code that runs for 4 ms*/
        })
        /* Click handle code that runs for 8ms */
    })
    secondButton.addEventListener("click", function secondHandler(){
        /* Click handle code that runs for 5ms */
    })
    /* Code that runs for 15ms */
</script>
```

- The callbacks we attach through the promise’s then method, are always called asynchronously, even if we attach them to already resolved promises
- In this case, where we’ve created an **immediately resolved promise**, the JavaScript engine could immediately invoke the callback, because we **already know** that the promise is successfully resolved
    - But, <mark>for **consistency**</mark> sake, the JavaScript engine doesn’t do this, and instead calls all promise callbacks asynchronously, after the rest of the firstHandler code (which runs for 8 ms) is done executing
    - It does this by creating a new microtask and pushing it onto the microtask queue
- Timing diagram
    - Macrotask queue @ 15 ms
        - First click handler creates and immediately resolves the promise, which queues a microtask **right after current Macrotask queue**
        - If a microtask is queued in the microtask queue, it **gets priority** and is processed even if an older task is already waiting in the queue. In this case, the promise success microtask gets priority over the `secondButton` click event task
    - Macrotask queue @ 23 ms
        - After the first click handler is finished, the next task is chosen from the microtask queue (even if there’s a task already waiting)
        - Microtasks are small tasks that should be executed as soon as possible, but without interrupting the currently running task
    - Macrotask queue @ 27 ms
        - After the microtask queue is empty, the event loop moves back to processing the macrotask queue
- Every time a task is processed, the event loop first checks the **microtask queue**, with the goal of processing all microtasks **before** continuing on to either rendering or other tasks
- After a macrotask gets executed, the event loop immediately moves onto handling the microtask queue, **without allowing rendering until the microtask queue is empty**
    - A page can be re-rendered between two macrotasks, while it can’t be rendered before a microtask is executed (if exists)
    - Microtasks have priority over rendering
    - A render can also occur after a microtask, but only if no other microtasks are waiting in the microtask queue
    - There’s nothing stopping the promise success microtask from queuing other microtasks, and that all of these microtasks will have priority over the `secondButton` click task
    - The event loop will re-render the page and move onto the `secondButton` task **only when** the microtask queue is empty
## Taming timers: time-outs and intervals
- Timers enable us to delay the execution of a piece of code by **at least** a certain number of milliseconds
    - A timer’s delay isn’t guaranteed
    - We’ll use this capability to break long-running tasks into smaller tasks that won’t clog the event loop, thereby stopping the browser from rendering, and in the process making our web applications slow and unresponsive
- Similarly to the event loop, **timers aren’t defined within JavaScript itself**; instead they’re provided by the **host environment**
### Timer execution within the event loop

```html
<script>
    setTimeout(function timeoutHandler(){
        /* Some timeout handle code that runs for 6ms */
    }, 10)
    setInterval(function intervalHandler(){
        /* Some interval handle code that runs for 8ms */
    }, 10)
    const myButton = document.getElementById("myButton")
    myButton.addEventListener("click", function clickHandler(){
        /* Some click handle code that runs for 10ms */
    })
    /* code that runs for 18ms */
</script>
```

- Timer events are placed in the (macro)task queue
- A quick and impatient user clicks the button 6 ms into the application execution
    - Macrotask queue @ 0 ms
        - The first task is to evaluate mainline JS code
    - Macrotask queue @ 6 ms
        - The click event is added to the queue
    - Macrotask queue @ 10 ms
        - Both timer events are added to the queue, in the order they were registered
        - **Timer events are added to the queue after the specified time has elapsed (when the timer expires and the interval fires)**
    - Macrotask queue @ 18 ms
        - The click task is processed
    - Macrotask queue @ 20 ms
        - Another interval fires
        - Normally, this would create a new task and add it to the task queue. But this time, because **an instance of an interval task is already queued** and awaiting execution, this invocation is dropped
        - The browser won’t queue up more than one instance of a specific interval handler
    - Macrotask queue @ 28 ms
        - The timeout task is processed
    - Macrotask queue @ 30 ms
        - An interval fires, but a new task is not created, because there’s already a matching task in the event queue