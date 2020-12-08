import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('should returns a 404 if the provided id dose not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asd123',
      price: 20,
    })
    .expect(404);
});
it('should returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asd123',
      price: 20,
    })
    .expect(401);
});
it('should returns a 401 if the user dose not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asd12',
      price: 22,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asd13',
      price: 22,
    })
    .expect(401);
});
it('should returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asd12',
      price: 22,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 22,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asd22',
      price: -22,
    })
    .expect(400);
});
it('should updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asd12',
      price: 22,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asd222',
      price: 222,
    })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketRes.body.title).toEqual('asd222');
  expect(ticketRes.body.price).toEqual(222);
});
it('should publishes an event', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asd12',
      price: 22,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asd222',
      price: 222,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should Rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asd12',
      price: 22,
    });
  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });

  await ticket!.save();
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asd222',
      price: 222,
    })
    .expect(400);
});
