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
    const zoos = await db("zoos");
    if (zoos) {
      res.status(200).json(zoos);
    }
  } catch (error) {
    res.status(500).json({ message: `Zoos could not be found ${error}.` });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const zoo = await db("zoos")
      .where({ id })
      .first();
    if (zoo) {
      res.status(200).json(zoo);
    } else {
      res
        .status(404)
        .json({ message: "Zoo with specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ message: `Zoo request failed ${error}.` });
  }
});

router.post("/", async (req, res) => {
  const zoo = req.body;
  if (!zoo.name) {
    res.status(400).json({ message: "Please enter a valid zoo name." });
  } else {
    try {
      const [id] = await db("zoos").insert(zoo);
      if (id) {
        const newZoo = await db("zoos")
          .where({ id })
          .first();
        res.status(201).json(newZoo);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: `Your zoo could not be posted ${error}.` });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const zoo = await db("zoos")
      .where({ id })
      .first();
    if (zoo) {
      const deleted = await db("zoos")
        .where({ id })
        .del();
      if (deleted) {
        res.status(200).json(zoo);
      }
    } else {
      res
        .status(404)
        .json({ message: "The zoo with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({
      message: `The zoo's information could not be modified: ${error}.`
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newZoo = req.body;

  if (!newZoo.name) {
    res.status(400).json({ message: "Please enter a valid zoo name." });
  } else {
    try {
      const editedZoo = await db("zoos")
        .where({ id })
        .update(newZoo);
      if (editedZoo) {
        const zoo = await db("zoos")
          .where({ id })
          .first();
        res.status(200).json(zoo);
      } else {
        res
          .status(404)
          .json({ message: "The zoo with the specified ID does not exist." });
      }
    } catch (error) {
      res.status(500).json({
        message: `The zoo's information could not be modified: ${error}.`
      });
    }
  }
});

module.exports = router;
