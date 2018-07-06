import { createAction, createActions } from 'redux-actions';

export const decrement = createAction('decrement');

export const actionCreators = createActions({
  APP: {
    COUNTER: {
      INCREMENT: (amount = 1) => amount,
      DECREMENT: undefined
    }
  }
});
