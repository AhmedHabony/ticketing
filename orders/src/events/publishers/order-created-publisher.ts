import { OrderCreatedEvent, Publisher, Subjects } from '@ticketme/commonn';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
