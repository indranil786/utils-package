import client, { Connection, Channel, ConsumeMessage } from 'amqplib';
export default class RabbitMq {
  url: string;
  channels: Map<string, Channel>;
  connection!: Connection;
  constructor(url: string) {
    this.url = url;
    this.channels = new Map();
  }

  async connect(RABBIT_MQ_USERNAME: string, RABBIT_MQ_PASSWORD: string) {
    if (this.connection) {
      return this.connection;
    }
    try {
      this.connection = await client.connect(
        `amqp://${RABBIT_MQ_USERNAME}:${RABBIT_MQ_PASSWORD}@${this.url}`
      );
      console.log(`Fastjobs Rabbit Mq Service Started for ${this.url}`);
    } catch (e) {
      console.error(e);
      console.error('Could not connect to RabbitMq');
      //   process.exit(1);
    }
    return this.connection;
  }

  /**
   *
   * @param {string} queue
   * @returns {Promise<amqp.Channel>}
   */
  async getChannel(queue: string): Promise<Channel> {
    return this.channels.get(queue) ?? this.createChannel(queue);
  }

  async createChannel(queue: string): Promise<Channel> {
    const channel = await this.connection.createChannel();
    channel.assertQueue(queue, {
      durable: false,
    });
    this.channels.set(queue, channel);
    return channel;
  }

  //   /**
  //  *
  //  * @param {string} queue
  //  * @param {string} msg (json string)
  //  * @returns {Promise<boolean>}
  //  */
  async sendToQueue(queue: string, msg: string) {
    const channel = await this.getChannel(queue);
    return channel.sendToQueue(queue, Buffer.from(msg));
  }

  //     /**
  //  *
  //  * @param {string} queue
  //  * @param {(msg: amqp.Message, channel: amqp.Channel) => void} listener
  //  * @returns
  //  */
  async consume(
    queue: string,
    listener: (msg: ConsumeMessage | null, channel: Channel) => void
  ) {
    // add type here
    const channel = await this.getChannel(queue);
    return channel.consume(queue, (msg) => listener(msg, channel));
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
