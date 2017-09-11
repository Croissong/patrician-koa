import { Context, Middleware } from 'koa';
import * as pathToRegexp from 'path-to-regexp';

import { Backend } from './backend';

export const AuthMiddleware = (backend: Backend): Middleware => {
  const matchRoute = pathToRegexp('/auth/:token')
  return async (ctx: Context, next: () => Promise<any>): Promise<any> => {
    const match = matchRoute.exec(ctx.path);
    if (match) {
      const success = await backend.register(match[1]);
      if (success) {
        ctx.redirect('/');
      } else {
        ctx.redirect('/login/403');
      }
    } else {
      await next();
    }
  };
}
