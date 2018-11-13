# JSX
- JSX
  - `<h1>Hello, world!</h1>`
  - A Syntax extension to JS
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

    3. React reads these objects and uses them to construct the DOM and keep it up to date. React DOM takes care of updating the DOM to match the React elements
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
- ***React elements are immutable***
    - Once you create an element, you can’t change its **children** or **attributes**
    - An element is like a single **frame** in a movie: it represents the UI at a certain point in time
# Components and Props
- (React) Elements make up components

continue here https://reactjs.org/docs/rendering-elements.html#react-only-updates-whats-necessary