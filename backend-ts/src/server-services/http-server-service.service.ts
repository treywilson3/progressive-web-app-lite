import { createServer } from 'http';
import { debug } from 'console';

export class HttpServerService {
  private server: any;
  private port = process.env.PORT || 3000;

  constructor(private app: any) {
    this.createHttpServer();
  }

  get httpServer(): any {
    return this.server;
  }

  private createHttpServer(): void {
    this.server = createServer(this.app);
    this.server.on('error', error => {
      if (error.syscall !== 'listen') {
        throw error;
      }
      const addr = this.server.address();
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + this.port;
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
    this.server.on('listening', () => {
      const addr = this.server.address();
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + this.port;
      debug('Listening on ' + bind);
    });
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    return this.server;
  }
}
