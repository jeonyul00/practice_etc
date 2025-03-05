import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LoginRequestAction,
  LoginSuccessAction,
} from './types';

// ✅ 로그인 요청 액션
export const loginRequest = (
  id: string,
  nickname: string,
): LoginRequestAction => ({
  type: LOGIN_REQUEST,
  payload: {id, nickname},
});

// ✅ 로그인 성공 액션
export const loginSuccess = (
  id: string,
  nickname: string,
): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: {id, nickname},
});
