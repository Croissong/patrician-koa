import { connect, Connection, Channel } from 'amqplib';
import { EventEmitter } from 'eventemitter3';
import * as uuid from 'uuid/v4';

export class PhoenixBackend implements Backend {
  responseEmitter: EventEmitter;
  private channel: Channel;

  async connect() {
    try {
      const conn = await connect('amqp://localhost');
      this.channel = await this.createChannel(conn);
      return true;
    } catch {
      return false;
    }
  }

  async createChannel(conn: Connection) {
    const channel = await conn.createChannel();
    const responseEmitter = new EventEmitter();
    Object.assign(this, { responseEmitter });
    channel.consume(REPLY_QUEUE,
      (msg) => {
        const response = msg.content.toString();
        responseEmitter.emit(msg.properties.correlationId, JSON.parse(response));
      },
      { noAck: true });
    return channel;
  }

  private sendRPCMessage(message: object) {
    return new Promise((resolve) => {
      const correlationId = uuid();
      // listen for the content emitted on the correlationId event
      this.responseEmitter.once(correlationId, resolve);
      this.channel.sendToQueue('state', new Buffer(JSON.stringify(message)),
        { correlationId, replyTo: REPLY_QUEUE });
    });
  }

  async getInitialState(route: string, userHash: string): Promise<object> {
    const resp = await this.sendRPCMessage({});
    return Promise.resolve(resp);
  }

}


const REPLY_QUEUE = 'amq.rabbitmq.reply-to';

export interface Backend {
  connect(): Promise<boolean>;
  getInitialState(route: string, userHash: string): Promise<object>;
}
