import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@ticketme/commonn';
import { Message } from 'node-nats-streaming';
import { TicketCratedListener } from '../ticket-crated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCratedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'correct',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};
it('should creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('should acks the message', async () => {

  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()
});