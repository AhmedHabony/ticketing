import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@ticketme/commonn';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20,
    userId: 'asdf',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: 'asd',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, order, listener };
};

it('updates the status and acks the message', async () => {
  const { msg, data, order, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
