import {takeEvery, put, delay} from 'redux-saga/effects';
import {loginRequest, loginSuccess} from '../reducers/userReducer';

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  console.log('로그인 요청 받음', action.payload);

  yield delay(3000);

  if (action.payload) {
    yield put(loginSuccess(action.payload));
  }
}

export function* userSaga() {
  yield takeEvery(loginRequest.type, handleLogin);
}
