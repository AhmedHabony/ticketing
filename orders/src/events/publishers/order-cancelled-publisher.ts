import { OrderCancelledEvent, Publisher, Subjects } from '@ticketme/commonn';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
