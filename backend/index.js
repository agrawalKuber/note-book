const connectToMongo = require("./DB");
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// My Routes
app.use("/OneNote/auth", require("./routes/auth"));
app.use("/OneNote/notes", require("./routes/notes"));

app.listen(PORT, () => {
  console.log(` app listening at http://localhost:${PORT} `);
});
