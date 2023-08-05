const express = require("express");
const router = express.Router();
const connection = require("../sql"); // Import the connection
const bcrypt = require("bcrypt");

function userExists(username) {
  return new Promise((resolve, reject) => {
    sql = "SELECT * FROM users WHERE username = ?";
    vars = [username];
    connection.query(sql, vars, async (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (res.length > 0) {
          resolve(res[0]);
        } else {
          resolve(null);
        }
      }
    });
  });
}

// Route for user registration
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const exists = await userExists(username);
  if (!exists) {
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
  } else {
    res.status(200).send("Username taken");
  }
});

module.exports = router;
