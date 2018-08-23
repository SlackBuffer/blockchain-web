import { effects } from 'redux-sirius';

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

const { put } = effects;

export default {
  state: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1
  },
  effects: ({takeEvery}) => ({
    asyncDecrement: takeEvery(function* (){
      yield delay(2000);
      yield put({ type: 'count/decrement' });
    })
  })
}
