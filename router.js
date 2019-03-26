const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};

const db = knex(knexConfig);

router.get("/", async (req, res) => {
  res.send(200);
});

router.get("/", async (req, res) => {
  res.send(200);
});

router.post("/", async (req, res) => {
  res.send(200);
});

router.delete("/", async (req, res) => {
  res.send(200);
});

router.put("/", async (req, res) => {
  res.send(200);
});

module.export = router;
