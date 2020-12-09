import request from "supertest";
import { app } from "../../app";

it("should response with details about the current user ", async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(res.body.constructor.email).toEqual("test@test.com");
});

it("should response with not if not aut..", async () => {
  const res = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
