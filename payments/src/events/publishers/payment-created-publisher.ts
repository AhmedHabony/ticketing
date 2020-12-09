import { Subjects, Publisher, PaymentCreatedEvent } from '@ticketme/commonn';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
