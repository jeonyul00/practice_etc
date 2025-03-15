import React from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import store from './src/stores';
import LoginButton from './src/components/LoginButton';
import {UserState} from './src/stores/types';
import Chat from './src/chat/Index';

const AppContent = () => {
  const {isLogin, nickname} = useSelector((state: UserState) => state);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        {isLogin ? `환영합니다, ${nickname}님!` : '로그인이 필요합니다.'}
      </Text>
      {isLogin && <Chat />}
      {!isLogin && <LoginButton />}
    </SafeAreaView>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, marginBottom: 10},
});

export default App;
