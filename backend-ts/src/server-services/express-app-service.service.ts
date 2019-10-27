import express from 'express';
import bodyParser from 'body-parser';
import webpush from 'web-push';
import { GithubUserInfo } from '../models/github-user-info';

export class ExpressAppService {
  private app: express.Application;

  constructor() {
    this.createAndInitalizeApp();
    this.vapidKeys();
  }

  get appInstance(): express.Application {
      return this.app;
  }

  private vapidKeys(): void {
    const vapidKeys = {
        publicKey:
          'BHSbWbPPX1gqie5DQR_us9UlB0b_lZFs6V1_ISGAN_0nuYVhiDCNyROko9wIsFbiZEpza1z_NxrEpnQleTKf4cc',
        privateKey: 'srBHJEsIzSDnKXcamnHJml0H1uP2v7bHFRpoTmf4B4E',
      };
      // setting our previously generated VAPID keys
    webpush.setVapidDetails(
        'mailto:trey.wilson3@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
}

private sendNotification(subscription, dataToSend= ''): void {
    webpush.sendNotification(subscription, dataToSend);
}

  private createAndInitalizeApp(): void {
    this.app = express();
    this.otherAppStuff();
  }
  private otherAppStuff(): void {
    this.app.set('port', 3000);
    // if we did not use bodyParser.json(), we would have to deal with manually parsing the data
    // which would cause multiple repeated lines of coded and having to handle potentially different sent data
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
    });

    this.app.post('/api/githubUserInfo', (req, res, next) => {
        const githubUserInfo = new GithubUserInfo({
            login: req.body.login,
            htmlUrl: req.body.htmlUrl
        });
        githubUserInfo.save().then(object => {
            res.status(201).json({
            message: 'Github User Info added successfully',
            postId: object._id
            });
        });
    });

    const dummyDb = { subscription: null }; // dummy in memory store
    const saveToDatabase = async subscription => {
    // Since this is a demo this.app, I am going to save this in a dummy in memory store. Do not do this in your this.apps.
    // Here you should be writing your db logic to save it.
    dummyDb.subscription = subscription;
    };
    // The new /save-subscription endpoint
    this.app.post('/save-subscription', async (req, res) => {
        const subscription = req.body;
        await saveToDatabase(subscription); // Method to save the subscription to Database
        res.json({ message: 'success' });
    });

    // // route to test send notification
    this.app.get('/send-notification', (req, res) => {
        const subscription = dummyDb.subscription; // get subscription from your databse here.
        const message = 'Hello World';
        this.sendNotification(subscription, message);
        res.json({ message: 'message sent' });
    });

    this.app.get('/api/githubUserInfo', (req, res, next) => {
        GithubUserInfo.find().then(savedUsers => {
            res.status(200).json({
            message: 'Got all saved users for ya fam',
            savedUsers
            });
        });
    });

    this.app.delete('/api/deleteAll/githubUserInfo', (req, res, next) => {
        GithubUserInfo.deleteMany({}).then(result => {
            console.log(result);
            res.status(200).json({ message: 'All users deleted' });
        });
    });
  }
}
