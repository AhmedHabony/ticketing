import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@ticketme/commonn';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
