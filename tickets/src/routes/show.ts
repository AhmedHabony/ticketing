import express, { Response, Request } from 'express';
import { NotFoundError } from '@ticketme/commonn';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);

  if (!ticket) throw new NotFoundError();

  res.send(ticket);
});

export { router as showTicketRouter };
