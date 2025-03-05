import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './userReducer';
import counterReducer from './counterReducer';

// ✅ 루트 리듀서 정의
const rootReducer = combineReducers({
  user: userReducer, // userReducer를 user라는 키로 저장 (주의!)
  counter: counterReducer, // counterReducer를 counter라는 키로 저장
});

// ✅ RootState 타입 정의 후 내보내기
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
