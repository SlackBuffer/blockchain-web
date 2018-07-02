import { FETCH_USER_FAILED, INCREMENT, DECREMENT, ENGINE_METHOD_NONE, FETCH_USER_SUCCESS, IS_FETCHING_USER } from '../constants'

export const increment = () => {
  return {
    type: 'counter/asyncAdd'
  }
};
/* export const increment = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch({
        type: INCREMENT
      })
    }, 2000);
  };
}; */

export const decrement = () => {
  return {
    type: DECREMENT
  }
};

export const get_user = () => {
  return {
    type: 'user/fetch'
  };
};

/* export const get_user = () => {
  return dispatch => {
    dispatch(fetching_user());
    fetch("https://randomuser.me/api/").then(
      res => res.json()
    ).then(
      data => {
        dispatch(fetch_success(data.results[0]))
      }
    ).catch(
      error => {
        console.log('....', error);
        dispatch(fetch_failed(error.message));
      }
    )
  }
};

export const fetch_success = (user) => {
  return {
    type: FETCH_USER_SUCCESS,
    user
  };
}; */

export const fetch_failed = (error) => {
  return {
    type: FETCH_USER_FAILED,
    error
  };
};

export const fetching_user = () => {
  return {
    type: IS_FETCHING_USER
  };
};