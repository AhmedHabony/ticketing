import { Subjects } from './subject';

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: String;
    title: String;
    price: number;
    userId: string;
  };
}
