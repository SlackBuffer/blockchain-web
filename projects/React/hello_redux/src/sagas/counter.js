import { delay } from 'redux-saga';
import { takeEvery, takeLatest, put, call } from 'redux-saga/effects';
import { INCREMENT } from '../constants';

function* incrementAsync() {
  yield call(delay, 1000);
  yield put({ type: INCREMENT });
}

export function* watchIncrementAsync() {
  yield takeEvery('counter/asyncAdd', incrementAsync);
}