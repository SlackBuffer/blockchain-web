# Motivation
- Hard to reuse stateful logic between components
    - React doesn’t offer a way to “attach” reusable behavior to a component (for example, connecting it to a store
    - A “wrapper hell” of components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions
    - These patterns require you to restructure your components when you use them
- Complex components become hard to understand
    - Each lifecycle method often contains a mix of unrelated logic. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method
    - In many cases it’s not possible to break these components into smaller ones because the stateful logic is all over the place
    - It’s also difficult to test them
    - This is one of the reasons many people prefer to combine React with a separate state management library
    - However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult
    - **Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data)**, rather than forcing a split based on lifecycle methods
# Usage
- Hooks are functions that let you “hook into” React state and lifecycle features from function components
- Hooks are a way to **reuse stateful logic, not state itself**. In fact, each call to a Hook has a completely isolated state — so you can even use the same custom Hook twice in one component
- Function components
- Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects
- There are two common kinds of side effects in React components: those that don’t require cleanup, and those that do
    1. Network requests, manual DOM mutations, and logging are common examples of effects that don’t require a cleanup
        - We say that because we can run them and immediately forget about them
- Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI
- In React class components, the `render` method itself shouldn’t cause side effects. It would be **too early** — we typically want to perform our effects after React has updated the DOM
- You can’t use Hooks inside of a class component, but you can definitely mix classes and function components with Hooks in a single tree. Whether a component is a class or a function that uses Hooks is an implementation detail of that component
## Built-in hooks
### `useState`
- Calling `useState` declares a "state variable". It returns a pair: the current state value and a function to update the value
    - Variable name doesn't matter. It's just a way to preserve some values between two function calls
- React preserves this state between re-renders
    - Normally, variables "disappear" when the function exits
- Updating a state **doesn't merge** the old and new state together, it always **replaces** it
    - **`useReducer` is more suited for managing state objects that contain multiple sub-values**
- The initial state argument is **only used during the first render**
    - The initial state doesn't have to be an object
- If we wanted to store two different values in state, we would call `useState` twice
    - You **don't have to** use many state variables. State variable can hold objects and arrays just fine
    - Split state into multiple state variables based on which values tend to change together
        - It makes it easy to later extract some related logic into a custom Hook
- React assumes that if you call `useState` many times, you do it in the same order during every render
- e.g.

    ```jsx
    const useInputValue = initialValue => {
        const [value, setValue] = useState(initialValue)
        return {
            value
            onChange: e => setValue(e.target.value),
            resetValue: () => setValue("")
        }
    }
    export default () => {
        const { resetValue, ...text } = useInputValue("")
        // const email = useInputValue("")
        return (
            <form onSubmit= { e => {
                e.preventDefault()
                onSubmit(text.value)
                resetValue()
            }}
                <input { ...text } />
            </form>
        )
    }
    ```

- Reference
    - During the initial render, the returned state (`state`) is the same as the value passed as the first argument (`initialState`)
    - The `setState` function accepts a new state value and enqueues a re-render of the component
    - During subsequent re-renders, the first value returned by `useState` will always be the most recent state after applying updates
    - (*Lazy initialization*) The initialState argument is the state used during the initial render. In subsequent renders, it is **disregarded**
        -  If the initial state is the result of an expensive computation, you may provide a function instead, which will be executed only on the initial render
### `useEffect`
- ***Unify*** `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` into a single API
    - Unlike `componentDidMount` or `componentDidUpdate`, effects scheduled with useEffect don’t **block** the browser from updating the screen
        - The function passed to `useEffect` fires after layout and paint, during a deferred event
        - This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn’t block the browser from updating the screen
    - This makes your app feel more responsive. The majority of effects don’t need to happen synchronously.
    - React **defers** running `useEffect` until after the browser has painted
    - ***The function passed to `useEffect` will run after the render is committed to the screen***
        - Think of effects as an escape hatch from React’s purely functional world into the imperative world
    - Although `useEffect` is deferred until after the browser has painted, it’s guaranteed to fire before any new renders. React will always flush a previous render’s effects before starting a new update
    - [ ] <u>Knowledge gap</u>: layout, paint, render
    - However, not all effects can be deferred. For example, a DOM mutation that is visible to the user must fire synchronously before the next paint so that the user does not perceive a visual inconsistency
    - In the uncommon cases where they do (such as measuring the layout), there is a separate `useLayoutEffect` Hook with an API identical to `useEffect`
- By using this Hook, you tell React that your component needs to do something after render. React will **remember** the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates
- When you call `useEffect`, you're telling React to run your "effect" function after flushing changes to the DOM
- By default, **React runs the effects after every render** - both after the first render and after every update
    - React guarantees the DOM has been updated by the time it runs the effects
- Effects may also optionally specify how to "clean up" after them by returning a function
- If your effect returns a function, React will run it when it is time to clean up
    1. React performs the cleanup when the component unmounts
    2. Effects run for every render and not just once. This is why React also cleans up effects from the previous render before running the effects next time
    - The clean-up function runs before the component is removed from the UI to prevent memory leaks. Additionally, if a component renders multiple times (as they typically do), the previous effect is cleaned up before executing the next effect
    - > https://reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update
- Use multiple effects to **separate concerns**. Separate unrelated logic into different effects
- Skip re-subscribing
    - Pass an array as an optional second argument
    - Works for effects with or without a cleanup phase
    - If you use this optimization, make sure the array includes **any values from the outer scope that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders
    - If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run (don't make it a habit because it often leads to bugs)
- Placing `useEffect` **inside the component** lets us access the count state variable (or any props) right from the effect. We don’t need a special API to read it — it’s already in the function scope. Hooks **embrace JavaScript closures** and avoid introducing React-specific APIs where JavaScript already provides a solution
- The function passed to `useEffect` is going to be different on every render
    - This is **intentional**. In fact, this is what lets us read the `count` value from inside the effect without worrying about it getting stale
    - Every time we re-render, we schedule a different effect, replacing the previous one
    - In a way, this makes the effects behave more like a part of the render result — each effect “belongs” to a particular render
- e.g.

    ```jsx
    const useFetch = (url) => {
        const [data, setData] = useState(null)
        const [loading, setLoading ] = useState(true)
        useEffect(async () => {
            const response = await fetch(url)
            const data = await response.json()
            setData(data)
            setLoading(false) 
        })
        return { data, loading }
    }
    ```

- Reference
    - The array of inputs (second parameter) is not passed as arguments to the effect function. Conceptually, though, that’s what they represent: every value referenced inside the effect function should also appear in the inputs array. In the future, a sufficiently advanced compiler could create this array automatically
### [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext)
- Subscribe to React context without introducing nesting
- Accepts a context object (the value returned from `React.createContext`) and returns the current context value, as given by the nearest context provider for the given context
- When the provider updates, this Hook will trigger a rerender with the latest context value
### [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)
- Manage local state of complex components with a reducer
- `const [state, dispatch] = useReducer(reducer, initialState)`
- An alternative to `useState`
- Accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method
- `useReducer` accepts an optional third argument, `initialAction`. If provided, the initial action is applied during the initial render. This is useful for computing an initial state that includes values passed via props
- `useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values
- [ ] It also lets you optimize performance for components that trigger deep updates because you can pass `dispatch` down instead of callbacks
### `useMutationEffect`
- Fires synchronously during the same phase that React performs its DOM mutations, before sibling components have been updated
- Use this to perform custom DOM mutations
- Avoid reading from the DOM in `useMutationEffect`. If you do, you can cause performance problems by introducing layout thrash
- When reading computed styles or layout information, `useLayoutEffect` is more appropriate
### `useLayoutEffect`
- Fires synchronously after all DOM mutations
- Use this to read layout from the DOM and synchronously re-render
- Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint
- `useLayoutEffect` fires in the same phase as `componentDidMount` and `componentDidUpdate`
## Custom hooks
- A custom Hook is a JavaScript function whose name starts with ”use” and that may call other Hooks
    - The `useSomething` naming convention is how our linter plugin is able to find bugs in the code using Hooks
    - Just like in a component, make sure to only call other Hooks unconditionally at the top level of your custom Hook
- Custom Hooks are a convention that naturally follows from the design of Hooks, rather than a React feature
- Two components using the same hook don't share state
    - Custom Hooks are a mechanism to reuse stateful logic (such as setting up a subscription and remembering the current value), but every time you use a custom Hook, all state and effects inside of it are fully isolated
- > https://reactjs.org/docs/hooks-custom.html#tip-pass-information-between-hooks
## Rules of hooks
- Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions
    - Ensure that hooks are called in the same order each time a component renders
    - That’s what allows React to correctly preserve the state of Hooks between multiple `useState` and `useEffect` calls
        - **React relies on the order in which Hooks are called**
        - As long as the order of the Hook calls is the same between renders, React can associate some local state with each of them
        - > https://reactjs.org/docs/hooks-rules.html#explanation
    - If we want to run an effect conditionally, we can **put that condition inside our Hook**
- Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions
    - There is just one other valid place to call Hooks — your own custom Hooks
    - By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code
    - > https://reactjs.org/docs/hooks-rules.html#eslint-plugin
# From classes to hooks
- `constructor`: Function components don’t need a constructor. You can initialize the state in the useState `call`. If computing it is expensive, you can pass a function to `useState`
- `getDerivedStateFromProps`: Schedule an update while rendering instead
    - [ ]
- `shouldComponentUpdate`: See `React.memo`
    - [ ] 
- `render`: This is the function component body itself
- `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: The `useEffect` Hook can express all combinations of these (including less common cases)
- `componentDidCatch` and `getDerivedStateFromError`: There are no Hook equivalents for these methods yet, but they will be added soon
- Instance variables
    - The `useRef()` Hook isn’t just for DOM refs. The “ref” object is a generic container whose `current` property is mutable and can hold any value, similar to an instance property on a class
    - Conceptually, you can think of refs as similar to instance variables in a class
    - Avoid setting refs during rendering — this can lead to surprising behavior
    - Instead, only modify refs in event handlers and effects
- [ ] [Run an effect only on updates](https://reactjs.org/docs/hooks-faq.html#can-i-run-an-effect-only-on-updates)
- [ ] [**Get the previous props, state**](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)
- [ ] [Implement `getDerivedStateFromProps`](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)
- [ ] [Implement `shouldComponentUpdate`](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)
- [ ] [Memorize calculations](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)
# Follow up
- [ ] callback in `this.setState`
- [ ] add `dispatch` in the overall provider, `useContext`
- [ ] `useReducer`'s `dispatch` and `redux`'s `dispatch`