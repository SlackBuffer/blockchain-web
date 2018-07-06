import { handleActions } from 'redux-actions';

const rootReducer = handleActions(
  {
    'APP/COUNTER/INCREMENT': (state, action) =>
      // console.log('#####', action);
      ({ counter: state.counter + action.payload }),
    decrement: (state, action) =>
      // console.log('#####', action);
      ({ counter: state.counter - action.payload })
  },
  { counter: 0 }
);

export default rootReducer;

/* 
{
  counter: counter,
  user: user,
  ...
} 
*/
