import { delay } from 'redux-saga';
import { takeEvery, takeLatest, put, call } from 'redux-saga/effects';

import { FETCH_USER_FAILED, INCREMENT, DECREMENT, ENGINE_METHOD_NONE, FETCH_USER_SUCCESS, IS_FETCHING_USER } from '../constants'

/* const newFetch = (args) => {
  return fetch(args).then(
      res => res.json()
    ).then(
      data => {
        yield put({ type: FETCH_USER_SUCCESS, user: data.results[0] });
      }
    ).catch(
      error => {
        yield put({ type: FETCH_USER_FAILED, error: error.message });
      }
    )
} */

const newFetch = (args) => {
  return fetch(args)
  .then(res => res.json())
  .then(user => {
    return user.results[0];
  });
}

function* fetch_user() {
  yield put({ type: IS_FETCHING_USER });
  try {
    const data = yield call(newFetch, 'https://randomuser.me/api/');
    yield put({ type: FETCH_USER_SUCCESS, user: data });  
  } catch (error) {
    yield put({ type: FETCH_USER_FAILED, error: error.message });
  }
}

export function* watchIncrementAsync() {
  yield takeEvery('user/fetch', fetch_user);
}