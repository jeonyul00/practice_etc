import React, {useRef, useState} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/*
  이 URL은 WebSocket 서버의 입구: baseUrl
  SockJS(url)을 사용해서 WebSocket 서버에 연결
  보통 https://your-server.com/chat 같은 형식으로 되어 있음.
*/
const url = 'https://test/chat';

/*
  useSocket은 특정 채팅방(roomId)에 WebSocket을 연결하는 훅
  이 훅을 사용하면 해당 채팅방의 메시지를 받을 수도 있고, 보낼 수도 있음
*/
const useSocket = (roomId: string) => {
  /*
    msg: 채팅 메시지를 저장하는 상태 (배열)
    isConnected: WebSocket이 연결되었는지 여부 (true/false)
  */
  const [msg, setMsg] = useState<{sender: string; msg: string}[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  /*
    stompClient: WebSocket 연결을 관리하는 객체
    useRef를 사용해서 WebSocket 클라이언트 상태를 유지
    연결이 끊기지 않도록 유지해야 하기 때문
  */
  const stompClient = useRef<Client | null>(null);

  React.useEffect(() => {
    /* 이미 연결되어 있는 경우, 중복 연결을 방지하기 위해 바로 종료! */
    if (stompClient.current && stompClient.current.connected) {
      console.warn('⚠️ 이미 연결된 WebSocket입니다.');
      return;
    }

    /* 기존 WebSocket 연결이 있다면, 해제 후 다시 연결 */
    if (stompClient.current) {
      console.log('🔄 기존 WebSocket을 해제하고 새로운 방으로 연결합니다.');
      stompClient.current.deactivate();
    }

    /*
      소켓 연결 시작
      SockJS를 이용해서 WebSocket 서버와 연결을 맺어 줌.
    */
    const socket = new SockJS(url);

    /* STOMP 클라이언트 생성 (WebSocket을 쉽게 다룰 수 있게 해 줌) */
    const client = new Client({
      /*
        WebSocket 연결을 SockJS를 통해 설정
        SockJS를 STOMP와 연결해 줘야 메시지를 주고받음
      */
      webSocketFactory: () => socket,

      /*
        reconnectDelay: 5초마다 자동으로 재연결 시도
        네트워크가 끊겨도 다시 연결하려고 시도
      */
      reconnectDelay: 5000,

      /*
        onConnect: WebSocket 연결이 성공하면 실행되는 함수
        여기서 서버에서 보내주는 메시지를 구독
      */
      onConnect: () => {
        setIsConnected(true); // 연결 성공하면 isConnected를 true로 변경!

        /*
          서버에서 보내는 메시지를 받을 준비 (구독하기)
          `/topic/chat/${roomId}` 경로를 구독하면, 해당 채팅방의 메시지를 받을 수 있음
        */
        client.subscribe(`/topic/chat/${roomId}`, message => {
          /*
            받은 메시지가 존재하면, 기존 메시지 목록에 추가
            JSON 형식의 문자열을 실제 객체로 변환해서 저장
          */
          if (message.body) {
            setMsg(prevMessages => [...prevMessages, JSON.parse(message.body)]);
          }
        });
      },

      onStompError: error => {
        console.error('STOMP error:', error);
      },
    });

    /* WebSocket 연결을 활성화해서, 실제로 연결을 시도 */
    client.activate();
    stompClient.current = client; // WebSocket 클라이언트를 저장함.

    /* 컴포넌트가 사라지거나(roomId가 변경되면) 기존 WebSocket을 해제 */
    return () => {
      client.deactivate(); // 기존 WebSocket 연결을 해제
      setIsConnected(false); // 연결 상태도 false로 변경
    };
  }, [roomId]); // ✅ roomId가 변경되면 다시 연결!

  /*
    sendMessage 함수: 서버로 메시지를 보낼 때 사용
    사용자가 입력한 메시지를 WebSocket을 통해 서버로 보냄
  */
  const sendMessage = (message: string, sender: string) => {
    /*
      현재 WebSocket이 연결된 상태인지 확인
      연결되지 않았으면, 메시지를 보낼 수 없으니까 에러를 출력하고 종료
    */
    if (stompClient.current && stompClient.current.connected) {
      /*
        메시지를 서버로 전송하는 부분
        서버에서 메시지를 받은 후, 다른 모든 클라이언트에게 전달
      */
      stompClient.current.publish({
        /*
          destination: `/app/chat/${roomId}` → 서버에서 메시지를 받을 경로
          클라이언트가 보낸 메시지가 서버에서 이 경로로 전달됨
        */
        destination: `/app/chat/${roomId}`,

        /*
          body: 실제 메시지 내용
          JSON.stringify를 사용해 문자열 형태로 변환해서 보냄.
        */
        body: JSON.stringify({sender, message}),
      });
    } else {
      console.error('❌ STOMP client is not connected.'); // 연결 안 되어 있으면 에러 출력
    }
  };

  /* 최종적으로 메시지(msg), 메시지 전송 함수(sendMessage), 연결 상태(isConnected)를 반환 */
  return {msg, sendMessage, isConnected};
};

export default useSocket;

/*
  전체 흐름 정리
  1️⃣ WebSocket 연결을 맺는다. (`SockJS(url)`)
  2️⃣ `/topic/chat/${roomId}`을 구독해서 서버에서 보내는 메시지를 받는다.
  3️⃣ 사용자가 메시지를 입력하면 `/app/chat/${roomId}`로 서버에 메시지를 보낸다.
  4️⃣ 서버는 받은 메시지를 다시 `/topic/chat/${roomId}`을 구독 중인 모든 클라이언트에게 전송한다.
  5️⃣ 구독 중인 모든 클라이언트(같은 방에 있는 사람들)가 메시지를 받는다.

  ✅ 예제
  1. 유저 A가 `sendMessage("안녕!", "A")` 실행
  2. 메시지가 `/app/chat/123` 경로를 통해 서버로 전송됨.
  3. 서버가 메시지를 받은 후 `/topic/chat/123`에 메시지를 전송함.
  4. `useSocket('123')`를 사용 중인 모든 유저는 `/topic/chat/123`을 구독 중이므로 메시지를 자동으로 받음!
  5. 결과적으로, 유저 B도 `안녕!`이라는 메시지를 받을 수 있음.

  ✅ 결론:
  - `/app/...` → 서버로 메시지를 보낼 때 사용
  - `/topic/...` → 서버에서 메시지를 받을 때 사용
*/
