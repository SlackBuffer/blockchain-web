```jsx
import * as ActionTypes from './ActionTypes.js';
export default (state, action) => {
  const {counterCaption} = action;
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return {...state, [counterCaption]: state[counterCaption] + 1};
    //   return {...state, ...newState};
    case ActionTypes.DECREMENT:
      return {...state, [counterCaption]: state[counterCaption] - 1};
    default:
      return state
  }
}
```

```jsx
import {ADD_TODO, TOGGLE_TODO, REMOVE_TODO}from './actionTypes.js';
export default (state = [], action) => {
  switch(action.type) {
    case ADD_TODO: {
      return [
        {
          id: action.id,
          text: action.text,
          completed: false
        },
        ...state
      ]
    }
    case TOGGLE_TODO: {
      return state.map((todoItem) => {
        if (todoItem.id === action.id) {
           return {...todoItem, completed: !todoItem.completed};
        } else {
          return todoItem;
        }
      })
    }
    case REMOVE_TODO: {
      return state.filter((todoItem) => {
        return todoItem.id !== action.id;
      })
    }
    default: {
      return state;
    }
  }
}
```

```jsx
combineReducers({ counter, todos });
// ES6 shorthand property notation
combineReducers({ counter: counter, todos: todos });
```

```jsx
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
```

- 无状态组件写法

    ```jsx
    class Counter extends Component {
        render() {
            const {caption, onIncrement, onDecrement, value} = this.props;
            return (
                <div>
                    <button onClick={onIncrement}>+</button>
                    <button onClick={onDecrement}>+</button>
                    <span>{caption} count: {value}</span>
                </div>
            );
        }
    }

    function Counter(props) {
        const {caption, onIncrement, onDecrement, value} = props;    
        return (
            <div>
                <button onClick={onIncrement}>+</button>
                <button onClick={onDecrement}>+</button>
                <span>{caption} count: {value}</span>
            </div>
        );
    }

    function Counter({caption, onIncrement, onDecrement, value}) {
        return (
            <div>
                <button onClick={onIncrement}>+</button>
                <button onClick={onDecrement}>+</button>
                <span>{caption} count: {value}</span>
            </div>
        );
    }
    ```