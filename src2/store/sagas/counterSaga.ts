import {takeEvery, put, delay} from 'redux-saga/effects';
import {increment, decrement} from '../reducers/counterReducer';

function* handleIncrement() {
  console.log('1초 후 증가');
  yield delay(1000);
  yield put(increment());
}

function* handleDecrement() {
  console.log('1초 후 감소');
  yield delay(1000);
  yield put(decrement());
}

export function* counterSaga() {
  yield takeEvery(increment.type, handleIncrement);
  yield takeEvery(decrement.type, handleDecrement);
}
