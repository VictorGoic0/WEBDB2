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
  try {
    const bears = await db("bears");
    if (bears) {
      res.status(200).json(bears);
    }
  } catch (error) {
    res.status(500).json({ message: `bears could not be found ${error}.` });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bear = await db("bears")
      .where({ id })
      .first();
    if (bear) {
      res.status(200).json(bear);
    } else {
      res
        .status(404)
        .json({ message: "Bear with specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ message: `Bear request failed ${error}.` });
  }
});

router.post("/", async (req, res) => {
  const bear = req.body;
  if (!bear.name) {
    res.status(400).json({ message: "Please enter a valid bear name." });
  } else {
    try {
      const [id] = await db("bears").insert(bear);
      if (id) {
        const newBear = await db("bears")
          .where({ id })
          .first();
        res.status(201).json(newBear);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: `Your bear could not be posted ${error}.` });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bear = await db("bears")
      .where({ id })
      .first();
    if (bear) {
      const deleted = await db("bears")
        .where({ id })
        .del();
      if (deleted) {
        res.status(200).json(bear);
      }
    } else {
      res
        .status(404)
        .json({ message: "The bear with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({
      message: `The bear's information could not be modified: ${error}.`
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newBear = req.body;

  if (!newBear.name) {
    res.status(400).json({ message: "Please enter a valid bear name." });
  } else {
    try {
      const editedBear = await db("bears")
        .where({ id })
        .update(newBear);
      if (editedBear) {
        const bear = await db("bears")
          .where({ id })
          .first();
        res.status(200).json(bear);
      } else {
        res
          .status(404)
          .json({ message: "The bear with the specified ID does not exist." });
      }
    } catch (error) {
      res.status(500).json({
        message: `The bear's information could not be modified: ${error}.`
      });
    }
  }
});

module.exports = router;
