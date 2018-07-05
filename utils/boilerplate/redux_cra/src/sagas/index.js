import { all, fork } from 'redux-saga/effects';

import * as subSaga from './subSaga';

export default function* rootSage() {
  yield all([...Object.values(subSaga)].map(fork));
}
