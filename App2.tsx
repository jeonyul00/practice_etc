import React from 'react';
import {Provider} from 'react-redux';
import store from './src2/store';
import {Text, View, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from './src2/store/reducers';
import {loginRequest, logout} from './src2/store/reducers/userReducer';
import {increment, decrement} from './src2/store/reducers/counterReducer';

const AppContainer = () => {
  const dispatch = useDispatch();

  // ✅ Redux에서 상태 가져오기
  const {isLogin, id, nickname} = useSelector((state: RootState) => state.user);
  const counter = useSelector(
    (state: RootState) => state.counter.valuesssssssss,
  );

  return (
    <View style={{padding: 20}}>
      {/* 🔹 로그인 상태 표시 */}
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {isLogin ? `로그인: ${nickname} (${id})` : '로그아웃 상태'}
      </Text>

      {/* 🔹 로그인 / 로그아웃 버튼 */}
      {isLogin ? (
        <Button title="로그아웃" onPress={() => dispatch(logout())} />
      ) : (
        <Button
          title="로그인"
          onPress={() =>
            dispatch(loginRequest({id: '123', nickname: 'Junyul'}))
          }
        />
      )}

      <View style={{height: 20}} />

      {/* 🔹 카운터 표시 */}
      <Text style={{fontSize: 20}}>카운트: {counter}</Text>

      {/* 🔹 카운터 증가 / 감소 버튼 */}
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Button title="+" onPress={() => dispatch(increment())} />
        <View style={{width: 10}} />
        <Button title="-" onPress={() => dispatch(decrement())} />
      </View>
    </View>
  );
};

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

export default App;
