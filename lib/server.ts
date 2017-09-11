import * as Koa from 'koa';
import * as http from 'http';

export class Server {
  public server = new Koa();

  constructor() {
    this.server.keys = ['soehnke standheims'];
  }

  public use(middlewares: Koa.Middleware[]) {
    middlewares.forEach(m => this.server.use(m));
    return this;
  }

  public async start(port: number = 3000): Promise<http.Server> {
    console.info(`listening on port ${port}`);
    return await new Promise<http.Server>(resolve => {
      let server = this.server.listen(port, () => {
        resolve(server);
      })
    });
  }
}
