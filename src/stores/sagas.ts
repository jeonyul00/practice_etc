import {takeEvery, put, delay} from 'redux-saga/effects';
import {LOGIN_REQUEST, LOGIN_SUCCESS, LoginRequestAction} from './types';

// ✅ 로그인 요청 처리 (3초 후 로그인 성공 처리)
function* loginSaga(action: LoginRequestAction) {
  console.log('로그인 요청 받음', action.payload);

  yield delay(3000); // 3초 기다림 (API 요청 대체)

  yield put({
    type: LOGIN_SUCCESS,
    payload: action.payload,
  });
}

// ✅ 액션 감지
function* watchLogin() {
  yield takeEvery(LOGIN_REQUEST, loginSaga);
}

export default watchLogin;
