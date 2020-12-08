import { Publisher, Subjects, TicketCreatedEvent } from '@ticketme/commonn';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCrated = Subjects.TicketCrated;
}
