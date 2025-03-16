import {useCallback} from 'react';
import io, {Socket} from 'socket.io-client';

const url = 'https://test/chat';
const sockets: {[key: string]: Socket} = {};

const useSocket2 = (workspace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    sockets[workspace] = io(`${url}/${workspace}`, {transports: ['websocket']});
  }

  return [sockets[workspace], disconnect];
};

export default useSocket2;
