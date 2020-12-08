import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@ticketme/commonn';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'asd',
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: 'asd',
      price: 2,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};
it('should replicates the order info', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('should acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
