const express = require("express"); //commonJS module import

const zoosRouter = require("./zoos/zoos-router.js");
const bearsRouter = require("./bears/bears-router.js");

const server = express();

//middleware / add this for POST request
server.use(express.json());

server.get("/", (req, res) => {
  res.send("It's working!");
});

server.use("/api/zoos", zoosRouter);
server.use("/api/bears", bearsRouter);

module.exports = server; //CommonJS module server
