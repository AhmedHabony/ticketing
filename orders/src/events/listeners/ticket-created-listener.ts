import { Listener, Subjects, TicketCreatedEvent } from '@ticketme/commonn';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCratedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCrated = Subjects.TicketCrated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket
      .save()

    msg.ack();
  }
}
