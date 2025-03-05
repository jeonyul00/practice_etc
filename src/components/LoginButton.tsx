import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {loginRequest} from '../stores/actions';
import {useDispatch} from 'react-redux';

const LoginButton = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(loginRequest('user123', 'Yul'));
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>로그인</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default LoginButton;
