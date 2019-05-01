const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/bears.db3"
  }
  //   debug: true
};

const db = knex(knexConfig);
router.get("/", (req, res) => {
  db("bears")
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "The bears information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const bearId = req.params.id;
  db("bears")
    .where({ id: bearId })
    .first()
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res
          .status(404)
          .json({ message: "The bear with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The bear information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  db("bears")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("bears")
        .where({ id })
        .first()
        .then(bear => {
          res.status(200).json(bear);
        });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the bear to the database."
      });
    });
});

router.put("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record updated."}`
        });
      } else {
        res
          .status(404)
          .json({ message: "The bear with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The bear information could not be modified." });
    });
});

router.delete("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({
          message: {
            message: "The bear with the specified ID does not exist."
          }
        });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The bear information could not be removed." });
    });
});

module.exports = router;
