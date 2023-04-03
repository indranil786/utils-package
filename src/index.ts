import RabbitMq from './utils/mqconfig';
import Emailer from './utils/emailerConfig';
import { ConsumeMessage, Channel } from 'amqplib';
export { RabbitMq, ConsumeMessage, Channel, Emailer };
