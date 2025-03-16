import React, {useRef, useState} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const url = 'https://test/chat';

const useSocket = (roomId: string) => {
  const [msg, setMsg] = useState<{sender: string; msg: string}[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const stompClient = useRef<Client | null>(null);

  React.useEffect(() => {
    if (stompClient.current && stompClient.current.connected) {
      console.warn('⚠️ 이미 연결된 WebSocket입니다.');
      return;
    }

    if (stompClient.current) {
      console.log('🔄 기존 WebSocket을 해제하고 새로운 방으로 연결합니다.');
      stompClient.current.deactivate();
    }

    const socket = new SockJS(url);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/chat/${roomId}`, message => {
          if (message.body) {
            setMsg(prevMessages => [...prevMessages, JSON.parse(message.body)]);
          }
        });
      },

      onStompError: error => {
        console.error('STOMP error:', error);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [roomId]);

  const sendMessage = (message: string, sender: string) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({sender, message}),
      });
    } else {
      console.error('❌ STOMP client is not connected.');
    }
  };
  return {msg, sendMessage, isConnected};
};

export default useSocket;
