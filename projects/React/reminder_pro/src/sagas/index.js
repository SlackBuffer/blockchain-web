import { all, fork } from 'redux-saga/effects';

import * as subSaga from './subSaga';

export default function* rootSaga() {
  yield all([
    ...Object.values(subSaga)
  ].map(fork));
}