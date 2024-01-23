// crud-admin/server/src/app.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const shortageRoutes = require("./routes/shortages");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: process.env.ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
});

app.use("/api/auth", authRoutes);
app.use("/api/auth/shortages", shortageRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
