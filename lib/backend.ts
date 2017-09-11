// import { w3cwebsocket as ws } from 'websocket';
import { Socket, Channel } from '../lib/phoenix';

export class PhoenixBackend implements Backend {
  channel: Channel;

  async connect(): Promise<void> {
    // const url = process.env.NODE_ENV === 'prod' ? 'wss://cookingquests.com' : 'ws://localhost:4000';
    // const socket = new Socket(`${url}/socket`, { transport: ws });
    return Promise.resolve();
  }

  openChannels(socket: Socket, resolve: () => void): void {
    this.channel = socket.channel('state', {});
    this.channel.join(1000).receive('ok', resolve);
  }

  async getInitialState(route: string, userHash: string): Promise<object> {
    return Promise.resolve({});
  }

  async register(token: string): Promise<boolean> {
    return new Promise<boolean>(resolve => resolve(false));
  }

}

export interface Backend {
  connect(): Promise<void>;
  getInitialState(route: string, userHash: string): Promise<object>;
  register(token: string): Promise<boolean>;
}
