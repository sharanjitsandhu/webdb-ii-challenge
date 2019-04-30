const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3", // property specifying the adapter
  useNullAsDefault: true,
  connection: {
    // connection property can be a string or object
    filename: "./data/lambda.sqlite3" // from the root folder
  }
  //   debug: true
};

// select * from zoos
const db = knex(knexConfig);
router.get("/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "The zoos information could not be retrieved." });
    });
});

// select * from zoos where id = :id
router.get("/:id", (req, res) => {
  const zooId = req.params.id;
  db("zoos")
    .where({ id: zooId })
    .first() // by adding first() method, it won't show array instead we should only get one object
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res
          .status(404)
          .json({ message: "The zoo with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The zoo information could not be retrieved." });
    });
});

// insert into zoos () values (req.body)
router.post("/", (req, res) => {
  db("zoos")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("zoos")
        .where({ id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo);
        });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the zoo to the database."
      });
    });
});

router.put("/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} ${count > 1 ? "records" : "record updated"}`
        });
      } else {
        res
          .status(404)
          .json({ message: "The zoo with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The zoo information could not be modified." });
    });
});

router.delete("/:id", (req, res) => {
  db("zoos") // working with zoos tables
    .where({ id: req.params.id }) // filter that to guarantee that other records are not affecting during deleting process
    .del() // this is delete command
    .then(count => {
      if (count > 0) {
        res.status(204).end(); //end means ending the request
      } else {
        res.status(404).json({
          message: {
            message: "The zoo with the specified ID does not exist."
          }
        });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The zoo information could not be removed." });
    });
});

module.exports = router;
