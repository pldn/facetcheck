import * as io from 'socket.io-client';

// Example conf. You can move this to your config file.
// const host = 'http://localhost:3000';
// const socketPath = '/api/socket.io';
var _client:SocketClient;
export default class SocketClient {
  socket:SocketIOClient.Socket;
  host:string
  socketQueue:[string, Function][] = [];
  constructor(host:string) {
    this.host = host;
  }
  connect() {
    this.socket = io.connect(this.host);
    this.socket.once('connect', () => {
      this.drainQueue()
    })
    return Promise.resolve();
  }
  disconnect() {
    return new Promise((resolve) => {
      console.info('socketio: disconnected')
      this.socket.once('disconnect', resolve)
      this.socket.disconnect();
    });
  }

  emit(event:string, data:any) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.');

      return this.socket.emit(event, data, (response:any) => {
        // Response is the optional callback that you can use with socket.io in every request. See 1 above.
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }

        return resolve();
      });
    });
  }
  on(event:string, func:Function) {
    console.info('io on', event)
    if (!this.socket) {
      console.info('Adding event to socket queue, as websocket is not instantiated')
      this.socketQueue.push([event, func])
    } else {
      this.socket.on(event, func);
    }
  }
  private drainQueue() {
    this.socketQueue.forEach(queueItem => {
      this.on(queueItem[0], queueItem[1]);
    })
  }

  off(event:string, func?:Function) {
    console.info('io off', event)
    if (!this.socket) throw new Error('No socket connection.');

    this.socket.off(event, func);
  }
  hasListener(event:string) {
    if (!this.socket) throw new Error('No socket connection.');

    return this.socket.hasListeners(event)
  }
}

/**
Allow setting and getting the client directly as well (and not neccessarily via the redux store)
This is particularly useful for registering and unregistering listeners, as these are simple synchronous
calls, and I don't want to mess around with redux for these simple operations
**/
export function getInstance() {
  return _client;
}
export function setInstance(socketClient:SocketClient) {
  _client = socketClient;
}
