// app.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const port = process.env.PORT;
const login = require("./routes/login");

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

//routes
app.use("/login", login);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
