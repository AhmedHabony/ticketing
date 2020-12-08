import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketme/commonn';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
