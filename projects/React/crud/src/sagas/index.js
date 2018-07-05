import { all, fork } from 'redux-saga/effects';

import * as games from './games';

export default function* rootSage() {
  yield all([...Object.values(games)].map(fork));
}
