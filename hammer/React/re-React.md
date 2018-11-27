# Digesting
- React DOM: React way of representation of the web page
# JSX
- JSX
  - `<h1>Hello, world!</h1>`
  - A Syntax extension to JavaScript
- JSX produces *React "elements"*
- Any valid JavaScript expression can be put inside the ***curly braces*** in JSX
- After compilation, JSX expressions **become regular JavaScript function calls and evaluate to plain JavaScript objects**
    1. Babel compiles JSX down to `React.createElement()` calls

        ```jsx
        const element = <h1 className="greeting">Hello, world!</h1>
        
        const element = React.createElement(
            'h1',
            {className: 'greeting'},
            'Hello, world!'
        )
        ```

    2. `React.createElement()` performs some checks to help you write bug-free code but essentially it creates an object (***React elements***) like this:

        ```JSX
        const element = {
            type: 'h1',
            props: {
                className: 'greeting',
                children: 'Hello, world!'
            }
        }
        ```

    3. React reads these objects and uses them to construct the DOM and keep it up to date / **React DOM takes care of updating the DOM to match the React elements**
- Wrap JSX over multiple lines in **parentheses** to avoid pitfalls of [automatic semicolon insertion](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)
- React DOM uses camelCase property naming convention instead of HTML attribute names
- By default, React DOM [escapes](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them
    - **Everything is converted to a string before being rendered**
    - Thus it ensures that you can never inject anything that’s not explicitly written in your application
    - This helps prevent XSS (cross-site-scripting) attacks
# Rendering elements
- `<div id="root"></div>` is a root DOM node
    - **Everything inside it will be managed by React DOM**
    - To render a React element into a root DOM node, pass both to `ReactDOM.render()`
    - > As long as we render `<Clock />` into the same DOM node, only *****a single instance***** of the `Clock` class will be used
- ***React elements are immutable***
    - Once you create an element, you can’t change its **children** or **attributes**
    - An element is like a single **frame** in a movie: it represents the UI at a certain point in time
- React only updates what's necessary
    - React DOM compares the **element** and **its children** to the previous, and only applies the DOM updates necessary to bring the DOM to the desired state
- Thinking about **how the UI should look at any given moment rather than how to change it over time** eliminates a whole class of bugs
# Components and Props
- React elements can represent both **DOM tags** and **user-defined components**
- (React) Elements make up components
- Conceptually, components are like JavaScript functions. They **accept arbitrary inputs (called “props”)** and **return React elements** describing what should appear on the screen
- A component transforms props into UI
- Function and class components are **equivalent** from React's point of view
- When React sees an element representing a user-defined component, it passes JSX attributes to this component as **a single object** (`props`)
- Always start component name with a capital letter. React treats components starting with lowercase letters as DOM tags
    - [ ] https://reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized
- Name props from the component's own point of view rather than the context in which it is being used
- All React components must act like **pure** functions with respect to their props. They should never modify their own props
    1. Pure functions: won't change their inputs, and always return the same result for the same inputs
    2. Impure functions: Ones that change their inputs
# State and lifecycle
- Local (encapsulated) state is a feature available only to classes. It's private and fully controlled by the component
- [ ] Class components should always call the base constructor with `props`
- `this.props` is set up by React itself and `this.state` has special meaning
    - It's free to add **additional fields** to the class manually to store something that doesn't participate in the data flow (like a timer)
- React may **batch** multiple `setState()` calls into a single update for performance. Because `this.props` and `this.state` may be updated asynchronously, you shouldn't rely on their values for calculating the next state
    - Use function form of `setState` - [ ] That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument
- State updates are **merged** - When you call `setState`, React merges the object you provide into the current object
- ***"Unidirectional" data flow***
    - Neither parent nor child components can know if a certain is stateful or stateless, and they shouldn't care whether is is defined as a function or a class
        - > The `FormattedDate` component would receive the `date` in its props and wouldn’t know whether it came from the `Clock`’s state, from the `Clock`’s props, or was typed by hand
    - The data flows down. A**ny state is always owned by some specific component**, and any data or UI derived from that state can only affect components "below" them in the tree
    - All components are truly isolated
# Handling events
- React events are named using camelCase
- With JSX you pass a function as the event handler, rather than a string
- In React you must call `preventDefault` explicitly to prevent default behavior rather than returning `false`
- When using React you should generally not need to call `addEventListener` to add listeners to a DOM element after it is created. Instead, just provide a listener when the element is initially rendered
- Bind `this`
    1. [Public class fields syntax](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)
    2. Arrow function - `<button onClick={ e => this.handleClick(e) }>`
        - A **different** callback is created each time the button renders
        - If the callback is passed as a prop to lower components, those components **might do an extra re-rendering**
    3. Bind in constructor
- Passing arguments to event handlers

    ```jsx
    <button onClick={e => this.deleteRow(id, e)}>Delete Row</button>
    <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
    ```

    - With an arrow function, we have to pass `e` explicitly, [ ] but with `bind` any further arguments are automatically forwarded
# Conditional rendering
- Use variables to store elements (element variables)
- `&&`
    - `true && expression` always evaluates to `expression`, `false && expressson` always evaluates to `false`
    - React will ignore `false` and skip it
- Ternary operator `condition ? true : false`
- Make a component to hide itself even though it was rendered by another component
    - Return `null`
    - Returning `null` from a component's `render` **does not affect the firing of the component's lifecycle methods**
# Lists and keys
- Keys should be given to the elements inside the array to give the elements a **stable identity**
- Keys help React identify which items have changed, are added, or are removed
    - A key is the only thing React uses to identify DOM elements
    - Keys must only be **unique among siblings**, they don't need to be globally unique
    - [ ] https://reactjs.org/docs/reconciliation.html
- If an explicit key is not assigned to the list items, React will **default** to using indexes as keys
- Only use the item index as a key as a last resort
    - When you push an item to the list or remove something in the middle, if the key is same as before React assumes that the DOM element represents the same component as before. But that is no longer true
- It's the the elements inside the `map()` call that need keys. Keys only makes sense in the context of the surrounding array
- Keys serve as a **hint** to React but they **don't get passed to the components**
- If the `map()` body is too nested, it might be a good time to extract a component
# Forms
- Form elements naturally keep some internal state
    - Form elements such as `<input>`, `<textarea>`, and `<select>` typically maintain their own state and update it based on user input
- A controlled component is an input form element whose value is controlled by React
    - The React component that renders a form controls what happens in that form on subsequent user input
    - React state is the "single source of truth"
    - The `value` attribute is set on the form element
- React `value`: `<input type="text">`, `<textarea>`, `<select>`
    - Passing an array into the `value` attribute allows you to select multiple options in a `select` tag
- > `<input type="file">` let the user choose one or more files to be uploaded to a server or manipulated by JavaScript via the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications). Its value is [ ] **read-only**, it's an [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html) in React
- Specifying the `value` value (except `undefined`, `null`) on a controlled component prevents the user from changing the input
- > [A complete solution including validation, keeping track of the visited fields, and handling form submission](https://jaredpalmer.com/formik)
- Round to the third decimal place - `Math.round(output * 1000) / 1000`
# Composition vs Inheritance
- Some components don't know their children ahead of time. It's recommended that such components use the special `children` to pass children directly into their output
- React elements are just objects, so you can pass them as props like any other data
- Components may accept arbitrary props, including primitive values, React elements, or functions
# Thinking in React
- Single responsibility principle - a component should ideally only do one thing
- Process
    1. Break the UI into a component hierarchy
    2. Build a static version in React
    3. Identify the minimal (but complete) representation of UI state
    4. Identify where your state should live
    5. Add inverse data flow
# [Accessibility](https://reactjs.org/docs/accessibility.html)
- All `aria-*` HTML attributes are fully supported in JSX
    - These attributes are hyphen-cased (also known as kebab-case, list-case, etc)
- Semantic HTML is the foundation of accessibility in web application
    - Sometimes we break HTML semantics when we add `<div>` elements to JSX to make React code work, especially when working with lists (`<ol>`, `<ul>`, and `<dl>`) and the HTML `<table>`. In these cases we should rather use React fragments to group together multiple elements
        - You can map a collection of items to an array of fragments
        - When you don't need any props on the Fragment tag you can use the short syntax (`<></>`)
    - > [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- Every HTML form control, such as `<input>` and `<textarea>`, needs to be labeled accessibly
- Ensure the web application can be fully operated with the keyboard only
- Keyboard focus and focus outline
    - Keyboard focus refers to the current element in the DOM that is selected to accept input from the keyboard
    - Only ever use CSS that removes the outline, for example by setting `outline: 0`, if you're replacing it with another focus outline implementation
- Mechanisms to skip to desired content
    - Provide a mechanism to allow users to skip past navigation sections as this assists and speeds up keyboard navigation
    - Skiplinks or [Skip Navigation Links](http://webaim.org/techniques/skipnav/) are hidden navigation links that only become visible when keyboard users interact with the page. They are very easy to implement with the internal page anchors and some styling
    - Also use [landmark elements](http://www.scottohara.me/blog/2018/03/03/landmarks.html) and roles, such as `<main>` and `<aside>`, to demarcate page regions as assistive technology allow the user to quickly navigate to these sections
- Programmatically managing focus
    - React applications continuously modify the HTML DOM during runtime, sometimes leading to keyboard focus being lost or set to an unexpected element
    - [Keyboard-navigable JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
    - Use Refs to DOM elements to set focus in React
- Mouse and pointer events
- Setting the language
- Setting the document title
- Color contrast
    - [Calculate an entire accessible color palette with Colorable](http://jxnblk.com/colorable/)
- Development and testing tools
# Fragments
- Fragments declared with the explicit `<React.Fragment>` syntax may have keys. `key` is **the only attribute** that can be passed to `Fragment` for now
- [Many tools](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax) don't support short syntax yet
# Refs and the DOM
- There're a few cases where you need to imperatively modify a child outside the typical dataflow (re-render the child with new props in order to modify it)
- Good cases for refs
    - Managing focus, text selection, or media playback
    - Triggering imperative animations
    - Integrating with third-party DOM libraries
- Refs provide a way to access DOM nodes or React elements created in the render method
- Avoid using refs for anything that can be done declaratively
- Refs are created using ***`React.createRef()` (1)*** and attached to React elements via the `ref` attribute
    - Refs are commonly assigned to an instance property when a component is constructed so they can be referenced throughout the component
- When a ref is passed to an element in `render`, a reference to that node becomes accessible at the `current` attribute of the ref
- The value of the ref differs depending on the type of the node
    - When the `ref` attribute is used on an HTML element, the `ref` created in the constructor with `React.createRef()` receives the underlying DOM element as its `current` property
        - React will assign the `current` property with the DOM element when the component mounts, and assign it back to `null` when it unmounts
        - **`ref` updates happen before** `componentDidMount` or `componentDidUpdate` lifecycle methods
    - When the `ref` attribute is used on a custom class component, the `ref` object receives the **mounted instance** of the component as its `current`
    - **You may not use the `ref` attribute on function components** because they don't have instances
        - You can **use the `ref` attribute *inside* a function component** as long as you refer to a DOM element or a class component
- In rare cases, you might want to have access to a child's DOM node from a parent component
    - This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for **triggering focus or measuring the size of position of a child DOM node**
- Adding a ref to the child component is not an ideal solution
    - You would only get a component instance rather than a DOM node
    - This wouldn't work with function components
    - For these cases, ref forwarding is recommended. [ ] Ref forwarding lets components opt into exposing any child component's ref as their own
    - Explicitly passing a ref as a differently named props is an alternative approach

        ```jsx
        // expose a DOM to components above (pre React 16.3)
        function CustomTextInput(props) {
            return <div><input ref={props.inputRef} /></div>
        }
        class Parent extends React.Component {
            constructor(props) {
                super(props)
                this.inputElement = React.createRef()
            }
            render() {
                return <CustomTextInput inputRef={this.inputElement} />
            }
        }
        ```

        - `this.inputElement.current` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`
    - Last option is to use `findDOMNode()`. It's discouraged and deprecated in `StrictMode`
- ***Callback refs (2)*** is another way to set refs

    ```jsx
    class CustomTextInput extends React.Component {
        constructor(props) {
            super(props)
            this.textInput = null
            this.setTextInputRef = element => {
                this.textInput = element
            }
            this.focusTextInput = () => {
                if (this.textInput) this.textInput.focus()
            }
        }
        componentDidMount() {
            this.focusTextInput() // autofocus the input on mount
        }
        render() {
            return (
                <div>
                    <input type="text" ref={this.setTextInputRef} />
                    <input type="button" value="focus the text input" onClick={this.focusTextInput} />
                </div>
            )
        }
    }
    ```

    - The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere
    - React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts
    - Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires

    ```jsx
    function CustomTextInput(props) {
        return <div><input ref={props.inputRef} /></div>
    }
    class Parent extends React.Component {
        render() {
            return <CustomTextInput inputRef={el => this.inputElement = el} />
        }
    }
    ```

    - `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`
    - If the `ref` callback is defined as an inline function, it will get **called twice during updates**, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to **clear the old ref and set up the new one**. You can avoid this by defining the `ref` callback as a bound method on the class, but it shouldn't matter in most cases
# Forwarding refs
- Ref forwarding is a technique for automatically passing a ref through a component to one of its children
- "Leaf" components like `FancyButton` or `MyTextInput` tend to be used throughout the application in a similar manner as a regular DOM `button` and `input`, and accessing their DOM nodes may be unavoidable for managing focus, selection, or animations
- Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down ("forward" it) to a child

    ```jsx
    const FancyButton = React.forwardRef((props, ref) => (
        <button ref={ref}>{props.children}</button>
    ))
    const ref = React.createRef()
    <FancyButton ref={ref}>Click me</FancyButton>
    ```

    - `ref.current` points to the `<button>` DOM node
    - This way, components using `FancyButton` can get a ref to the underlying `button` DOM node and access it if necessary—just like if they used a DOM `button` directly
    - The second `ref` argument only exists when you define a component with `React.forwardRef` call. Regular function or class components don’t receive the `ref` argument, and ref is not available in props either
    - Ref forwarding is not limited to DOM components. You can forward refs to class component instances, too
- > When you start using forwardRef in a component library, you should treat it as a breaking change and release a new major version of your library
- Forwarding ref in higher-order components
    - `ref` is not a prop. Like `key`, its handled differently by React
    - If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component
    - We can explicitly forward refs to the inner component using `React.forwardRef` API

        ```jsx
        function logProps(Component) {
            class LogProps extends React.Component {
                componentDidUpdate(prevProps) {
                    console.log('old props:', prevProps)
                    console.log('new props:', this.props)
                }
                render() {
                    const {forwardedRef, ...rest} = this.props
                    // Assign the custom prop "forwardedRef" as a ref
                    return <Component ref={forwardedRef} {...rest} />;
                }
            }
        // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
        // And it can then be attached to the Component.
            return React.forwardRef((props, ref) => {
                return <LogProps {...props} forwardedRef={ref} />
            })
        }
        ```

- Displaying a custom name in DevTools
    - `React.forwardRef` accepts a render function. React DevTools uses this function to determine what to display for the ref forwarding component

    ```jsx
    // The following component will appear as ”ForwardRef” in the DevTools
    const WrappedComponent = React.forwardRef((props, ref) => {
        return <LogProps {...props} forwardedRef={ref} />
    })
    // If you name the render function, DevTools will also include its name (e.g. ”ForwardRef(myFunction)”)
    const WrappedComponent = React.forwardRef(
        function myFunction(props, ref) {
            return <LogProps {...props} forwardedRef={ref} />
        }
    )
    // Set the function’s displayName property to include the component you’re wrapping
    function logProps(Component) {
        class LogProps extends React.Component {
            // ...
        }
        function forwardRef(props, ref) {
            return <LogProps {...props} forwardedRef={ref} />;
        }
        // Give this component a more helpful display name in DevTools. e.g. "ForwardRef(logProps(MyComponent))"
        const name = Component.displayName || Component.name;
        forwardRef.displayName = `logProps(${name})`;
        return React.forwardRef(forwardRef);
    }
    ```

# Higher-order components
- An HOC is a **function** that takes a component and returns a new component
- HOCs are a pattern that emerges from React's compositional nature
- Don’t mutate the original component. Use composition
- Convention: pass unrelated props through to the wrapped component

    ```jsx
    render() {
        // Filter out extra props that are specific to this HOC and shouldn't be passed through
        const { extraProp, ...passThroughProps } = this.props
        // Inject props into the wrapped component. These are usually state values or instance methods
        const injectedProp = someStateOrInstanceMethod;
        // Pass props to wrapped component
        return (
            <WrappedComponent
                injectedProp={injectedProp}
                {...passThroughProps}
            />
        )
    }
    ```

    - `ref` is not really a prop - like `key`, it's handled specially be React. If you add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the outermost container component, not the wrapped component
    - The solution is use the `React.forwardRef`
- Convention: maximizing composibility

    ```jsx
    // connect is a function that returns another function
    // connect is a higher-order function that returns a higher-order component
    // Instead of doing this...
    const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))
    // ... you can use a function composition utility
    // compose(f, g, h) is the same as (...args) => f(g(h(...args)))
    const enhance = compose(
        // These are both single-argument HOCs
        withRouter,
        connect(commentSelector)
    )
    const EnhancedComponent = enhance(WrappedComponent)
    ```

    - Single-argument HOCs like the one returned by the `connect` function have the signature `Component => Component`. ***Functions whose output type is the same as its input type are really easy to compose together***
- The container components created by HOCs show up in the React Developer Tools like any other component. To ease debugging, choose a display name that communicates that it’s the result of a HOC

    ```jsx
    function withSubscription(WrappedComponent) {
        class WithSubscription extends React.Component {/* ... */}
        WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`
        return WithSubscription
    }
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || WrappedComponent.name || 'Component'
    }
    ```

- React's diffing algorithm (*reconciliation*) uses **component identity** to determine whether it should update the **existing subtree** or throw it away and mount a new one
    - If the component returned from `render` is identical (`===`) to the component from the previous render, React recursively updates the subtree by diffing it with the new one
    - If they're not equal, the previous subtree is unmounted completely
- Don't use HOCs inside the render method

    ```jsx
    render() {
        // A new version of EnhancedComponent is created on every render
        // EnhancedComponent1 !== EnhancedComponent2
        const EnhancedComponent = enhance(MyComponent);
        // That causes the entire subtree to unmount/remount each time!
        return <EnhancedComponent />
    }
    ```

    - The problem isn't about performance - remounting a component causes the **state** of that component and all of its **children** to be lost
    - Instead apply HOCs **outside the component definition** so that the resulting component is created only once. Then its identity will be consistent across renders
- In those rare cases where you need to apply a HOC dynamically, you can also do it inside a component's lifecycle methods or its constructor
- Static methods must be copied over
- When you apply a HOC to a component, the original component is wrapped with a container component. The new component does not have any of the static methods of the original component

    ```jsx
    // Define a static method
    WrappedComponent.staticMethod = function() {/*...*/}
    // Now apply a HOC
    const EnhancedComponent = enhance(WrappedComponent)
    // The enhanced component has no static method
    typeof EnhancedComponent.staticMethod === 'undefined' // true

    function enhance(WrappedComponent) {
        class Enhance extends React.Component {/*...*/}
        // Must know exactly which method(s) to copy :(
        // You can use hoist-non-react-statics to automatically copy all non-React static methods
        Enhance.staticMethod = WrappedComponent.staticMethod;
        return Enhance
    }
    ```

    - Another method is to export the static method separately from the component itself
# Render Props
- **A render prop is a function prop that a component uses to know what to render**
- Render prop refers to a technique for **sharing code between React component using a prop** whose value is a **function**
- A component with a render prop **takes a function that returns a React element** and calls it **instead of implementing its own render logic**

    ```jsx
    <DataProvider render={data => <h1>hello {data.target}</h1>} />
    ```

- It's not obvious how to share the state or behavior that one component encapsulates to other components that need that same state
- Instead of hard-coding a `<Cat>` inside a `<Mouse>` component, and effectively changing its rendered output, we can provide `<Mouse>` with a **function prop** that it uses to **dynamically determine what to render** – a render prop

    ```jsx
    class Cat extends React.Component {
        render() {
            const mouse = this.pros.mouse
            return (
                <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }}
            )
        }
    }
    class Mouse extends React.component {
        state = { x: 0, y: 0 }
        handleMouse = e => {
            this.setState({
                x: e.clientX,
                y: e.clientY
            })
        }
        render() {
            return (
                <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
                    {/*
                        Instead of providing a static representation of what <Mouse> renders,
                        use the `render` prop to dynamically determine what to render.
                    */}
                    {this.props.render(this.state)} // 实参 this.state
                </div>
            )
        }
    }
    class MouseTracker extends React.Component {
        render() {
            return (
                <div>
                    <h1>Move the mouse around</h1>
                    <Mouse render={mouse => (
                        <Cat mouse={mouse} />
                    )} />
                </div>
            )
        }
    }
    ```

    - Instead of effectively cloning the `<Mouse>` component and hard-coding something else in its `render` method to solve for a specific use case, we provide a `render` prop that `<Mouse>` can use to dynamically determine what it renders
    - The main concept to understand here is that the `<Mouse>` component essentially exposes its state to the `<MouseTracker>` component by calling its (`<Mouse>`'s) render prop. Therefore, `<MouseTracker>` can render whatever it wants with that state
    - Additionally, **the composition model here is dynamic**! Everything happens inside of render, so we get to take full advantage of the React **lifecycle** and the natural flow of **props & state**
- Just because the pattern is called "render props" you don't have to use a prop named ***render*** to use this pattern. In fact, any prop that is a function that ***a component uses to know what to render*** is technically a "render prop"

    ```jsx
    <Mouse children={mouse => (
        <p>The mouse position is {mouse.x}, {mouse.y}</p>
    )} />
    // the children props doesn't need to be named in the list of 
    // attributes in the JSX element, you can put it directly inside 
    // the element
    <Mouse>
        {mouse => (
            <p>The mouse position is {mouse.x}, {mouse.y}</p>
        )}
    </Mouse>
    ```

- Using a render prop can **negate** the advantage that comes from using [ ] `React.PureComponent` if you **create a function** inside a `render` method
    - This is because the shallow prop comparison will always return `false` for new props, and each `render` in this case will generate a new value for the render prop
    - To get around this problem, you can sometimes define the prop as an **instance method**
        - > Defined as an instance method, `this.renderTheCat` always refers to *same* function when we use it in render
    - In cases where you cannot define the prop statically (e.g. because you need to close over the component’s props and/or state) `<Mouse>` should extend `React.Component` instead
- [ ] render props 实现路由保护
# Context
- Context provides a way to pass data through the component tree without having to pas props manually at every level
- Context is designed to share data that can be considered "global" for a tree of React components
    - Such as the current authenticated user, theme, or preferred language

    ```jsx
    // create a context for the current theme (with 'light' )
    const ThemeContext = React.createContext('light')
    class App extends React.Component {
        render() {
            return (
                <ThemeContext.Provider value="dark">
                    <Toolbar />
                </ThemeContext.Provider>
            )
        }
    }
    function Toolbar(props) {
        return <div><ThemeButton /></div>
    }
    class ThemeButton extends React.Component {
        // assign a contextType to read the current theme context
        // React will find the closest theme Provider above an use its value
        static contextType = ThemeContext
        render() {
            return <Button theme={this.context} />
        }
    }
    ```

- Applying context makes component reuse more difficult
- If you only want to passing some props through many levels, [component composition](https://reactjs.org/docs/context.html#before-you-use-context) is often a simpler solution than context
- `React.createContext`
    - `const MyContext = React.createContext(defaultValue)`
    - Creates a **Context object**
    - When React renders a component that subscribes to this Context it will read the current context value from the closest **matching `Provider`** above it in the tree
    - The `defaultValue` argument is **only** used when a component does not have a matching Provider (`<MyContext.Provider></MyContext.Provider>`) above it in the tree. This can be helpful for testing components in isolation without **wrapping** them
    - Passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`
- `Context.Provider`
    - `<MyContext.Provider value={/* some value */}>`
    - Every Context object comes with a **Provider React Component** that allows consuming components to subscribe to context changes
    - Accept a `value` prop to be passed to consuming components that are descendants of this Provider
    - One Provider can be connected to man consumers
    - Providers can be nested to override values deeper within the tree
    - All consumers that are descendants of a Provider will re-render **whenever the Provider's `value` prop changes**
        - The propagation from Provider to its descendant consumer is **not subject to the `shouldComponentUpdate` method**, so the consumer is updated even when an ancestor component bails out of the update
        - Changes are determined by comparing the new and old values using the same algorithm as `Object.is`
- `Class.contextType`
    - `MyClass.contextType = MyContext`, `static contextType = MyContext ` (public class fields syntax)
    - The `contextType` property on a ***class*** can be assigned a Context object created by `React.createContext()`. This lets you consume the nearest current value of that Context type using `this.context`
        - `this.context` can be referenced in any of the lifecycle methods including the render function
    - You can only subscribe to a single context using this API
- `Context.Consumer`
    - `<MyContext.Consumer>{value => /* render sth based on the context value /*}</MyContext.Consumer>`
    - A React component that subscribes to context changes
    - Allows you to subscribe to a context within a ***function component***
    - Requires a function as a child
        - The function receives the current context value and returns a React node
        - The `value` argument passed to the function will be equal to the `value` prop of **the closest Provider for this context** above
        - If there is no Provider for this context above, the `value` argument will be equal to the `defaultValue` that was passed to `createContext()`
        - 有 `MyProvider` 被创建，但 `MyProvider` 不是某个消费 `MyProvider` 的组件的上层组件中的一个，此时消费的组件会读到 `defaultValue`
- [Dynamic context](https://reactjs.org/docs/context.html#dynamic-context)
- It's often necessary to update the context from a component that is nested somewhere deeply in the component tree. In this case you can **pass a function down through the context** to allow consumers to update the context
    - [Updating Context from a nested component](https://reactjs.org/docs/context.html#updating-context-from-a-nested-component)
- To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree
    - If two of more context values are often used together, you might want ot consider creating your own render prop component that provides both
    - [Consuming multiple contexts](https://reactjs.org/docs/context.html#consuming-multiple-contexts)
- Context use **reference identity** to determine when to re-render
# Reconciliation
- React provides a **declarative API** so that you don't have to worry about exactly what changes on every update








continues here https://reactjs.org/docs/reconciliation.html