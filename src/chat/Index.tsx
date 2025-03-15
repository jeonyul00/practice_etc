import {View, Text, FlatList, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import useSocket from '../hooks/useSocket';

const Chat = () => {
  const {msg, sendMessage, isConnected} = useSocket('room-123');
  const [message, setMessage] = useState('');

  return (
    <View>
      <Text>{isConnected ? '🟢 연결됨' : '🔴 연결 안됨'}</Text>

      <FlatList
        data={msg}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Text>
            {item.sender}: {item.msg}
          </Text>
        )}
      />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="메시지 입력"
      />
      <Button
        title="전송"
        onPress={() => {
          sendMessage(message, 'User');
          setMessage('');
        }}
      />
    </View>
  );
};

export default Chat;
