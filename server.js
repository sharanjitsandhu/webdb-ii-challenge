const express = require("express"); //commonJS module import

const zoosRouter = require("./zoos/zoos-router.js");

const server = express();

//middleware / add this for POST request
server.use(express.json());

server.get("/", (req, res) => {
  res.send("It's working!");
});

server.use("/api/zoos", zoosRouter);

module.exports = server; //CommonJS module server
