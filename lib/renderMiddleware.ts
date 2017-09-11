import { Context, Middleware } from 'koa';
import * as Marko from 'marko';

export const RenderMiddleware = (templatePath: string): Middleware => {
  const template = Marko.load(templatePath, undefined, { writeToDisk: false });
  return async (ctx: Context): Promise<any> => {
    ctx.type = 'text/html';
    ctx.body = template.stream({
      initialState: JSON.stringify(ctx.state.initialState)
    });
  };
}
