import { Context, Middleware } from 'koa';

import { Backend } from './backend';

export const ApiMiddleware = (backend: Backend): Middleware => {
  return async (ctx: Context, next: () => Promise<any>): Promise<any> => {
    let user = ctx.cookies.get('user', { signed: true });
    const initialState = await backend.getInitialState(ctx.request.url, user)
    ctx.state.initialState = initialState;
    await next();
  }
}
