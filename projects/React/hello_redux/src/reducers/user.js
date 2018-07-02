import { FETCH_USER_FAILED, FETCH_USER_SUCCESS, IS_FETCHING_USER } from '../constants';

const initialState = {
  isFetching: false,
  error: null,
  user: {}
};

const user = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return { 
        isFetching: false,
        error: null,
        user: action.user
      };
    case FETCH_USER_FAILED:
      return { 
        isFetching: false,
        error: action.error,
        user: {}
      };
    case IS_FETCHING_USER:
      return {
        isFetching: true,
        error: null,
        user: {}
      };
    default: return state;
  }
};

export default user;