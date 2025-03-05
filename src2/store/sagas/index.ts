import {all, fork} from 'redux-saga/effects';
import {userSaga} from './userSaga';
import {counterSaga} from './counterSaga';

export default function* rootSaga() {
  yield all([fork(userSaga), fork(counterSaga)]);
}
