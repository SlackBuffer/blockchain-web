import { takeLatest, put, call } from 'redux-saga/effects';

function* fetchGames() {
  const result = yield call(fetch, '');
  console.log(result);
  yield put('abc');
}

export function* watchIncrementAsync() {
  yield takeLatest('api/games', fetchGames);
}
