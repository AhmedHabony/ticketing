import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'correct',
    price: 4,
    userId: '123',
  });

  await ticket.save();

  const fietInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  fietInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  await fietInstance?.save();

  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');

  // expect(async () => {
  //     await secondInstance?.save()
  // }).toThrow()
});

it('should increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'correct',
    price: 20,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
