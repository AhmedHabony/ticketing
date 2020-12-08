import { PaymentCreatedEvent, Publisher, Subjects } from '@ticketme/commonn';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
