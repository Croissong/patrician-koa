import { Server } from './server';
import { RenderMiddleware } from './renderMiddleware';
import { ApiMiddleware } from './apiMiddleware';

import { PhoenixBackend } from './backend';

createServer().then((server) => server.start(3001));

async function createServer() {
  const backend = new PhoenixBackend()
  await backend.connect();
  const api = await ApiMiddleware(backend);
  return new Server().use([
    api, RenderMiddleware('templates/index.html')
  ]);
}
