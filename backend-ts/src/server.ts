import express from 'express';
import mongoose from 'mongoose';
import { ExpressAppService } from './server-services/express-app-service.service';
import { HttpServerService } from './server-services/http-server-service.service';
import { SocketService } from './server-services/socket-service.service';


export class MyServer {
    public static readonly PORT: number = 3000;
    private app: express.Application;
    private httpServerService: HttpServerService;
    private socketService: SocketService;

    constructor() {
        this.app = new ExpressAppService().appInstance;
        this.httpServerService = new HttpServerService(this.app);
        this.socketService = new SocketService(this.httpServerService.httpServer, MyServer.PORT);
        this.startMongoose();
    }

    private async startMongoose(): Promise<void> {
        // use mongoose to save from boilerplate code. Allows us simple .save methods, schemas, and more
        try {
            await mongoose.connect(
            'mongodb+srv://admin:nCino001!@pwa-rfdrn.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true}
            );
            console.log('Connected to database!');
        } catch (event) {
            console.log('Connection Failed', event);
        }
    }

    public getApp(): any {
        return this.app;
    }
}
