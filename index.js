const express = require("express");
const helmet = require("helmet");
const router = require("./router");

const server = express();

server.use(express.json());
server.use(helmet());
server.use("/api/zoos", router);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
