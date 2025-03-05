import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  isLogin: boolean;
  id: string | null;
  nickname: string | null;
}

const initialState: UserState = {
  isLogin: false,
  id: null,
  nickname: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginRequest: (
      state,
      action: PayloadAction<{id: string; nickname: string}>,
    ) => {
      if (!state.isLogin) {
        console.log('로그인 요청 중...', action.payload);
      }
    },
    loginSuccess: (
      state,
      action: PayloadAction<{id: string; nickname: string}>,
    ) => {
      console.log('로그인 성공!');
      state.isLogin = true;
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
    },
    logout: state => {
      console.log('로그아웃!');
      state.isLogin = false;
      state.id = null;
      state.nickname = null;
    },
  },
});

// ✅ 액션 크리에이터 내보내기
export const {loginRequest, loginSuccess, logout} = userSlice.actions;

// ✅ 리듀서 내보내기
export default userSlice.reducer;
