const express = require("express");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());  // ✅ This enables JSON parsing
app.use(cors());

app.use("/auth", require("./src/routes/user"));
app.use("/api", require("./src/routes/order"));

app.listen(5000, () => console.log("Server running on port 5000"));
