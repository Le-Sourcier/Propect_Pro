require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
// const morgan = require("morgan");
const db = require("./db"); // Database connection

app.use(helmet()); // All default Helmet protections
// app.use(morgan("combined")); // Logging middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

const port = 3000;

// Public route
app.get("/", (req, res) => res.json({ message: "API is healthy!" }));

// Protected route
app.use("/api", require("./src/routers")); // will be accessible at /api/*
app.listen(port, () => {
  console.log(`Starting server on http://localhost:${port}`);
});
