import {
  UserState,
  UserActionTypes,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from './types';

// ✅ 초기 상태
const initialState: UserState = {
  isLogin: false,
  id: null,
  nickname: null,
};

// ✅ 리듀서 (상태 변경)
const userReducer = (
  state = initialState,
  action: UserActionTypes,
): UserState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      console.log('로그인 요청 중...');
      return {...state};

    case LOGIN_SUCCESS:
      console.log('로그인 성공!');
      return {
        isLogin: true,
        id: action.payload.id,
        nickname: action.payload.nickname,
      };

    default:
      return state;
  }
};

export default userReducer;
