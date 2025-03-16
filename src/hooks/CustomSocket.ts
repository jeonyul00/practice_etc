import {Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'https://test/chat';

interface ChatMessage {
  sender: string;
  message: string;
}

// 클래스형 예제
class SocketService {
  private client: Client | null = null;
  private roomId: string | null = null;
  private chatSubscription: any = null;
  private onMessageReceived: ((message: ChatMessage) => void) | null = null;

  connect(
    roomId: string,
    onMessageReceived: (message: ChatMessage) => void,
  ): void {
    if (this.client?.connected) {
      console.warn('⚠️ 이미 연결된 WebSocket입니다.');
      return;
    }

    if (this.client) {
      console.log('🔄 기존 WebSocket을 해제하고 새로운 방으로 연결합니다.');
      this.disconnect();
    }

    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;

    const socket = new SockJS(SOCKET_URL);
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('🟢 WebSocket 연결 성공');
        this.subscribeToRoom(roomId);
      },

      onStompError: error => {
        console.error('STOMP error:', error);
      },
    });

    this.client.activate();
  }

  /** 특정 채팅방 메시지 구독 */
  private subscribeToRoom(roomId: string): void {
    if (!this.client) {
      console.error('❌ WebSocket이 연결되지 않음.');
      return;
    }

    // 기존 구독이 있다면 해제
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }

    this.chatSubscription = this.client.subscribe(
      `/topic/chat/${roomId}`,
      (message: IMessage) => {
        if (message.body && this.onMessageReceived) {
          try {
            const parsedMessage: ChatMessage = JSON.parse(message.body);
            this.onMessageReceived(parsedMessage);
          } catch (error) {
            console.error('❌ 메시지 파싱 오류:', error);
          }
        }
      },
    );
  }

  /** 메시지 전송 (연결 끊어졌으면 자동 재연결) */
  async sendMessage(message: string, sender: string): Promise<void> {
    if (!this.client || !this.client.connected) {
      console.warn('⚠️ WebSocket이 끊어져 있음. 재연결 시도...');
      if (this.roomId && this.onMessageReceived) {
        await this.connect(this.roomId, this.onMessageReceived);
      } else {
        console.error('❌ WebSocket이 연결되지 않았고, 방 정보가 없음.');
        return;
      }
    }

    if (this.client && this.client.connected && this.roomId) {
      this.client.publish({
        destination: `/app/chat/${this.roomId}`,
        body: JSON.stringify({sender, message}),
      });
    } else {
      console.error('❌ WebSocket 연결이 되지 않아 메시지 전송 실패.');
    }
  }

  /** WebSocket 연결 해제 (구독도 해제) */
  async disconnect(): Promise<void> {
    try {
      this.chatSubscription?.unsubscribe();
      if (this.client) {
        await this.client.deactivate();
        this.client = null;
        console.log('🔴 WebSocket 연결 해제됨');
      }
    } catch (error) {
      console.error('❌ WebSocket 해제 중 오류 발생:', error);
    }
  }

  /** WebSocket 상태 반환 */
  getConnectionStatus(): boolean {
    return this.client?.connected ?? false;
  }
}

export default new SocketService();
