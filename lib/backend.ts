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
      await this.server(conn);
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
      (msg) => responseEmitter.emit(msg.properties.correlationId,
        JSON.parse(msg.content.toString())),
      { noAck: true });
    return channel;
  }

  async server(conn: Connection) {
    const ch = await conn.createChannel();

    ch.assertQueue('state');
    ch.consume('state', (msg) => {
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(msg.content),
        { correlationId: msg.properties.correlationId });

      ch.ack(msg);
    });
  }

  private sendRPCMessage(message: object) {
    return new Promise((resolve) => {
      const correlationId = uuid();
      // listen for the content emitted on the correlationId event
      this.responseEmitter.once(correlationId, resolve);
      this.channel.sendToQueue('state', new Buffer(JSON.stringify(initialState)),
        { correlationId, replyTo: REPLY_QUEUE });
    });
  }

  async getInitialState(route: string, userHash: string): Promise<object> {
    const resp = await this.sendRPCMessage({ test: 'test' });
    return Promise.resolve(resp);
  }

}


const REPLY_QUEUE = 'amq.rabbitmq.reply-to';

export interface Backend {
  connect(): Promise<boolean>;
  getInitialState(route: string, userHash: string): Promise<object>;
}

const initialState = {
  inventory: {
    selected: { Town1: '3', Town2: '4' },
    inventories: {
      1: {
        id: '1',
        date: '2017-09-06'
      },

      2: {
        id: '2',
        date: '2017-09-07'
      },

      3: {
        id: '3',
        date: '2017-09-08'
      },

      4: {
        id: '4',
        date: '2017-09-09'
      }
    },

    values: {
      1: {
        1: { buy: 1, sell: 10 },
        2: { buy: 1, sell: 10 },
        3: { buy: 1, sell: 10 },
        4: { buy: 1, sell: 10 },
        5: { buy: 1, sell: 10 },
        6: { buy: 1, sell: 10 },
        7: { buy: 1, sell: 10 },
        8: { buy: 1, sell: 10 },
        9: { buy: 1, sell: 10 },
        10: { buy: 1, sell: 10 },
        11: { buy: 1, sell: 10 },
        12: { buy: 1, sell: 10 },
        13: { buy: 1, sell: 10 },
        14: { buy: 1, sell: 10 },
        15: { buy: 1, sell: 10 },
        16: { buy: 1, sell: 10 },
        17: { buy: 1, sell: 10 },
        18: { buy: 1, sell: 10 },
        19: { buy: 1, sell: 10 },
        20: { buy: 1, sell: 10 }
      },
      2: {
        1: { buy: 2, sell: 20 },
        2: { buy: 2, sell: 20 },
        3: { buy: 2, sell: 20 },
        4: { buy: 2, sell: 20 },
        5: { buy: 2, sell: 20 },
        6: { buy: 2, sell: 20 },
        7: { buy: 2, sell: 20 },
        8: { buy: 2, sell: 20 },
        9: { buy: 2, sell: 20 },
        10: { buy: 2, sell: 20 },
        11: { buy: 2, sell: 20 },
        12: { buy: 2, sell: 20 },
        13: { buy: 2, sell: 20 },
        14: { buy: 2, sell: 20 },
        15: { buy: 2, sell: 20 },
        16: { buy: 2, sell: 20 },
        17: { buy: 2, sell: 20 },
        18: { buy: 2, sell: 20 },
        19: { buy: 2, sell: 20 },
        20: { buy: 2, sell: 20 }
      },
      3: {
        1: { buy: 3, sell: 30 },
        2: { buy: 3, sell: 30 },
        3: { buy: 3, sell: 30 },
        4: { buy: 3, sell: 30 },
        5: { buy: 3, sell: 30 },
        6: { buy: 3, sell: 30 },
        7: { buy: 3, sell: 30 },
        8: { buy: 3, sell: 30 },
        9: { buy: 3, sell: 30 },
        10: { buy: 3, sell: 30 },
        11: { buy: 3, sell: 30 },
        12: { buy: 3, sell: 30 },
        13: { buy: 3, sell: 30 },
        14: { buy: 3, sell: 30 },
        15: { buy: 3, sell: 30 },
        16: { buy: 3, sell: 30 },
        17: { buy: 3, sell: 30 },
        18: { buy: 3, sell: 30 },
        19: { buy: 3, sell: 30 },
        20: { buy: 3, sell: 30 }
      },
      4: {
        1: { buy: 4, sell: 40 },
        2: { buy: 4, sell: 40 },
        3: { buy: 4, sell: 40 },
        4: { buy: 4, sell: 40 },
        5: { buy: 4, sell: 40 },
        6: { buy: 4, sell: 40 },
        7: { buy: 4, sell: 40 },
        8: { buy: 4, sell: 40 },
        9: { buy: 4, sell: 40 },
        10: { buy: 4, sell: 40 },
        11: { buy: 4, sell: 40 },
        12: { buy: 4, sell: 40 },
        13: { buy: 4, sell: 40 },
        14: { buy: 4, sell: 40 },
        15: { buy: 4, sell: 40 },
        16: { buy: 4, sell: 40 },
        17: { buy: 4, sell: 40 },
        18: { buy: 4, sell: 40 },
        19: { buy: 4, sell: 40 },
        20: { buy: 4, sell: 40 }
      }
    }
  },

  town: {
    selected: { Town1: '1', Town2: '2' },
    inventories: {
      1: ['1', '3'],
      2: ['2', '4']
    }
  }
};
