const express = require("express");
const path = require("path");
const authenticate = require("./routes/authRoute");
const lobby = require("./routes/lobbyRoute");
const game = require("./routes/gameRoute");

const app = express();

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/", (req, res) => {
  res.send("WELCOME TO LUDO GAME, REGISTER OR LOG IN");
});
app.use("/authentication", authenticate);
app.use("/lobby", lobby);
app.use("/game", game);

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
