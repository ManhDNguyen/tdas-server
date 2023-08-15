const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const connectDatabase = require("./config/databaseConnection");

const BASE_URL = "/api";
const PORT = 3001;

// built-in middleware for json
app.use(express.json());

app.use(cors());

// endpoint for testing (http://localhost:3001/api/ in browser)
app.get(BASE_URL, (req, res) => {
  res.send("Hello World!");
});

// routes
app.use(BASE_URL + "/data", require("./routes/data"));

// connect to database and start express server
connectDatabase(); // apply database config
mongoose.connection.once("connected", () => {
  console.log("[INFO] Database connection successful");
  app.listen(PORT, () =>
    console.log(`[INFO] Server accessible at http://localhost:${PORT}/api/`)
  );
});
