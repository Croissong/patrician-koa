import { ContextualTestContext } from 'ava';
import { Context, Middleware } from 'koa';
import * as getPort from 'get-port';


import { Server } from '../../lib/server';
import { Backend } from '../../lib/backend';

export const testMiddleware = (ctx: Context) => ctx.body = testObjectString;
export const stateSetter = async (ctx: Context, next: Function) => {
  ctx.state.initialState = testObject;
  await next();
};
export async function createServer(t: ContextualTestContext, ...middlewares: Middleware[]) {
  let port = await getPort();
  let server = await new Server().use(middlewares).start(port);
  t.context.server = server;
  return server;
}

export const mockBackend: Backend = {
  connect: () => Promise.resolve(),
  getInitialState: (route: string, userHash: string) => Promise.resolve(testObject),
  register: (token) => Promise.resolve(token === 'validToken' ? true : false)
}

const testObject: object = { test: 'test' };
export const testObjectString: string = JSON.stringify(testObject);

export const config = {
  context: __dirname,
  entry: './entry.js',
  output: { path: '/', filename: 'bundle.js', publicPath: '/' }
};
