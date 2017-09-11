import * as webpack from 'webpack';
// import * as webpackMiddleware from 'koa-webpack';

// import { ApiMiddleware } from '../lib/apiMiddleware';
import { start } from '../lib/devServer';
import { mockBackend, config } from './util/util';

los()

async function los() {
  // let api = await ApiMiddleware(mockBackend);
  // let bodySetter = (ctx: any) => ctx.body = ctx.state.initialState;
  await start({compiler: webpack(config), config},
              mockBackend, 3213);
}
