const express = require("express");
const webpush = require('web-push') //requiring the web-push module
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const GithubUserInfo = require("./models/github-user-info");


// express is part of mean stack and gives us the regualr http verbs to use
// i.e., the .get, .post, etc is not standard from node. It is part of the express package
// node overs a httpclient, but again, it is not nearly as in depth as express.
const app = express();

const vapidKeys = {
  publicKey:
    'BHSbWbPPX1gqie5DQR_us9UlB0b_lZFs6V1_ISGAN_0nuYVhiDCNyROko9wIsFbiZEpza1z_NxrEpnQleTKf4cc',
  privateKey: 'srBHJEsIzSDnKXcamnHJml0H1uP2v7bHFRpoTmf4B4E',
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:trey.wilson3@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend='') => {
  webpush.sendNotification(subscription, dataToSend)
}

// use mongoose to save from boilerplate code. Allows us simple .save methods, schemas, and more
mongoose
  .connect(
    "mongodb+srv://admin:nCino001!@pwa-rfdrn.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true } 
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

  // if we did not use bodyParser.json(), we would have to deal with manually parsing the data
  // which would cause multiple repeated lines of coded and having to handle potentially different sent data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/githubUserInfo", (req, res, next) => {
  const githubUserInfo = new GithubUserInfo({
    login: req.body.login, 
    htmlUrl: req.body.htmlUrl
  });
  githubUserInfo.save().then(object => {
    res.status(201).json({
      message: "Github User Info added successfully",
      postId: object._id
    });
  });
});

const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body
  await saveToDatabase(subscription) //Method to save the subscription to Database
  res.json({ message: 'success' })
});

//route to test send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription //get subscription from your databse here.
  const message = 'Hello World'
  sendNotification(subscription, message)
  res.json({ message: 'message sent' })
})

app.get("/api/githubUserInfo", (req, res, next) => {
  GithubUserInfo.find().then(savedUsers => {
    res.status(200).json({
      message: "Got all saved users for ya fam",
      savedUsers
    });
  });
});

app.delete("/api/deleteAll/githubUserInfo", (req, res, next) => {
  GithubUserInfo.remove({}).then(result => {
    console.log(result);
    res.status(200).json({ message: "All users deleted" });
  });
});

module.exports = app;
