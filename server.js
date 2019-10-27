const app = require("./backend-js/app");
const debug = require("debug")("node-angular");
const http = require("http");
const GithubUserInfo = require("./backend-ts/src/models/github-user-info");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

const io = require('socket.io')(server);
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("addUser", function(user) {
    console.log(user);
    const githubUserInfo = new GithubUserInfo(user);
    githubUserInfo.save().then(object => {
    // echo the message back down the
    // websocket connection
    io.emit('addedUsers', object)
    });
  });
});

