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

continue here https://reactjs.org/docs/composition-vs-inheritance.html