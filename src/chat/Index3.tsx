import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import SocketService from '../hooks/CustomSocket';

/** 채팅 메시지 타입 */
interface ChatMessage {
  sender: string;
  message: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');
  const roomId = 'room-123';

  useEffect(() => {
    SocketService.connect(roomId, newMessage => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      SocketService.disconnect();
    };
  }, [roomId]);

  const handleSend = () => {
    if (message.trim()) {
      SocketService.sendMessage(message, 'jeonyul');
      setMessages(prev => [...prev, {sender: 'jeonyul', message}]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <Text
            style={styles.message}>{`${item.sender}: ${item.message}`}</Text>
        )}
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

export default Chat;
