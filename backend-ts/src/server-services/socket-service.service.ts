import socketIo from 'socket.io';
import { GithubUserInfo } from '../models/github-user-info';

export class SocketService {
  private io: SocketIO.Server;
  constructor(private server: any, private port: any) {
    this.start();
  }

  private start(): void {
    this.io = socketIo(this.server);
    this.listen();
  }

  private listen(): void {
    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on('addUser', user => {
          console.log(user);
          const githubUserInfo = new GithubUserInfo(user);
          githubUserInfo.save().then(object => {
          // echo the message back down the
          // websocket connection
          this.io.emit('addedUsers', object);
          });
        });

      socket.on('disconnect', () => {
          console.log('Client disconnected');
      });
  });
  }
}
