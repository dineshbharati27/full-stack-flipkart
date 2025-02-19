const express = require("express");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", require("./src/routes/user"));
app.use("/api", require("./src/routes/order"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => console.log("Server running on port 5000"));
