# Digesting
- React DOM: React way of representation of the web page
# JSX
- JSX
  - `<h1>Hello, world!</h1>`
  - A Syntax extension to JavaScript
- JSX produces *React "elements"*
- Any valid JavaScript expression can be put inside the curly braces in JSX
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
- Wrap JSX over multiple lines in parentheses to avoid pitfalls of [automatic semicolon insertion](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)
- React DOM uses camelCase property naming convention instead of HTML attribute names
- By default, React DOM [escapes](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) any values embedded in JSX before rendering them
    - **Everything is converted to a string before being rendered**
    - Thus it ensures that you can never inject anything that’s not explicitly written in your application
    - This helps prevent XSS (cross-site-scripting) attacks
# Rendering elements
- `<div id="root"></div>` is a root DOM node
    - **Everything inside it will be managed by React DOM**
    - To render a React element into a root DOM node, pass both to `ReactDOM.render()`
    - > As long as we render `<Clock />` into the same DOM node, only **a single instance** of the `Clock` class will be used
- ***React elements are immutable***
    - Once you create an element, you can’t change its **children** or **attributes**
    - An element is like a single **frame** in a movie: it represents the UI at a certain point in time
- React only updates what's necessary
    - React DOM compares the **element** and **its children** to the previous, and only applies the DOM updates necessary to bring the DOM to the desired state
- Thinking about **how the UI should look at any given moment rather than how to change it over time** eliminates a whole class of bugs
# Components and Props
- React elements can represent both DOM tags and user-defined components
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
- Local state is a feature available only to classes. It's private and fully controlled by the component
- [ ] Class components should always call the base constructor with `props`
- `this.props` is set up by React itself and `this.state` has special meaning
    - It's free to add **additional fields** to the class manually to store something that doesn't participate in the data flow (like a timer)

continue here https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly