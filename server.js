// app.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const mysql = require("mysql2");
const port = process.env.PORT;
const connection = require("./sql");
const login = require("./routes/login");
const register = require("./routes/register");

// Initialise mongodb for session storage
const store = new MongoDBStore({
  uri: process.env.DATABASE_URL,
  collection: "sessions", // Collection name for sessions
});

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store, // Use the MongoDB store
    cookie: {
      maxAge: 60000, // 60 seconds
    },
  })
);

// Listen for app termination signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Cleanup function to close the connection and exit the app
function cleanup() {
  console.log("Closing database connection...");
  connection.end((err) => {
    if (err) {
      console.error("Error closing database connection:", err);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(); // Exit the app
  });
}

//routes
app.use("/login", login);
app.use("/register", register);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
