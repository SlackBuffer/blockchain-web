import { all, fork } from 'redux-saga/effects';

import * as counter from './counter';
import * as user from './user';

export default function* rootSaga() {
  yield all([
    ...Object.values(counter),
    ...Object.values(user)
  ].map(fork));
}