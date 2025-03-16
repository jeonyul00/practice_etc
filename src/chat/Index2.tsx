import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import useSocket2 from '../hooks/useSocket2';

const Chat2 = () => {
  const [socket, disconnect] = useSocket2('workspaceId1');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    // 채팅방 입장 시 지난 메시지 요청
    socket.emit('joinRoom', 'workspaceId1');

    // 서버에서 이전 메시지 수신
    const handlePreviousMessages = (prevMessages: string[]) => {
      setMessages(prevMessages);
    };

    // 실시간 메시지 수신
    const handleMessage = (msg: string) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('previousMessages', handlePreviousMessages);
    socket.on('message', handleMessage);

    return () => {
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('message', handleMessage);
      disconnect();
    };
  }, [socket, disconnect]);

  // 메시지 전송
  const handleSend = () => {
    if (message.trim() === '' || !socket) {
      return;
    }
    socket.emit('message', message);
    setMessages(prev => [...prev, `나: ${message}`]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Text style={styles.message}>{item}</Text>}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요..."
        />
        <Button title="전송" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#fff'},
  message: {padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'},
  inputContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default Chat2;
