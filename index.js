const express = require("express");
const cors = require("cors")
const jwt = require('jsonwebtoken');
const path = require("path");
const authenticate = require("./routes/authRoute");
const lobby = require("./routes/lobbyRoute");
const game = require("./routes/gameRoute");

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Next.js frontend URL
}));

app.use("/authentication", authenticate);
app.use("/lobby", lobby);
app.use("/game", game);

const port = 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
