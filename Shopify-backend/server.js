const express = require("express");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Update CORS configuration
app.use(cors({
  origin: [
    'https://full-stack-flipkart-w4pp.vercel.app',
    'http://localhost:5173' // for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/auth", require("./src/routes/user"));
app.use("/api", require("./src/routes/order"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => console.log("Server running on port 5000"));
