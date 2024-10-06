const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const authenticate = require("./routes/authRoute");
const lobby = require("./routes/lobbyRoute");
const game = require("./routes/gameRoute");

const app = express();

app.use(express.json());

// CORS configuration with specific allowed origins
// const allowedOrigins = [
//   "http://localhost:3000", // Replace with your actual frontend URL
//   "https://your-ngrok-url.ngrok-free.app", // Replace with your ngrok frontend URL
// ];

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
};

app.use(cors(corsOptions)); // Apply CORS middleware

app.use("/authentication", authenticate);
app.use("/lobby", lobby);
app.use("/game", game);

const port = 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
