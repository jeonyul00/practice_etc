import {UnknownAction} from 'redux';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export interface UserState {
  isLogin: boolean;
  id: string | null;
  nickname: string | null;
}

export interface LoginRequestAction extends UnknownAction {
  type: typeof LOGIN_REQUEST;
  payload: {id: string; nickname: string};
}

export interface LoginSuccessAction extends UnknownAction {
  type: typeof LOGIN_SUCCESS;
  payload: {id: string; nickname: string};
}

export type UserActionTypes = LoginRequestAction | LoginSuccessAction;
