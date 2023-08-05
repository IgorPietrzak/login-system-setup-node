const express = require("express");
const router = express.Router();
const connection = require("../sql"); // Import the connection
const bcrypt = require("bcrypt");

// Route for user registration
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Define the SQL query
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  const values = [username, hashedPassword];

  // Execute the query
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding user:", err);
      res.status(500).send("Error adding user");
    } else {
      console.log("User added:", result);
      res.status(200).send(`New user created! Username: ${username}`);
    }
  });
});

module.exports = router;
