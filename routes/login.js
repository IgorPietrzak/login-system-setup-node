const express = require("express");
const router = express.Router();
const connection = require("../sql");
const bcrypt = require("bcrypt");

async function verifyCredentials(username, password) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const passwordHash = results[0].password; // Assuming results is an array
          const match = await bcrypt.compare(password, passwordHash);
          resolve(match);
        }
      }
    );
  });
}

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (req.session.authenticated) {
      res.status(200).send("You are logged in!");
    } else {
      const match = await verifyCredentials(username, password);
      if (match) {
        req.session.authenticated = true;
        req.session.user = {
          username,
        };
        res.json(req.session.user);
      } else {
        res.status(403).send("Bad credentials");
      }
    }
  } else {
    res.status(403).send("Bad credentials");
  }
});

router.get("/hidden", (req, res) => {
  if (req.session.authenticated) {
    res.send(req.session);
  } else {
    res.status(403).send("Not authenticated. Please log in");
  }
});

module.exports = router;
