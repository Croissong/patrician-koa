import * as request from 'supertest';
import test from 'ava';

import { AuthMiddleware } from '../lib/authMiddleware';
import { createServer, mockBackend } from './util/util';

test.afterEach((t) => t.context.server.close());

test('redirect to home on success', async (t) => {
  const auth = AuthMiddleware(mockBackend);
  let server = await createServer(t, auth);
  await request(server).get('/auth/validToken')
    .expect('location', '/')
});

test('redirect to login on fail', async (t) => {
  const auth = AuthMiddleware(mockBackend);
  let server = await createServer(t, auth);
  await request(server).get('/auth/invalid')
    .expect('location', '/login/403')
});

test('continue on unmatch route', async (t) => {
  const auth = AuthMiddleware(mockBackend);
  let server = await createServer(t, auth);
  await request(server).get('/blub')
    .expect(404)
});
