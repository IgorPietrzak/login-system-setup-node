const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (req.session.authenticated) {
      res.status(200).send("You are logged in!");
    } else {
      if (password === "Igor2003!") {
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

module.exports = router;
