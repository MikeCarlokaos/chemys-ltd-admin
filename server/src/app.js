// crud-admin/server/src/app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const shortageRoutes = require("./routes/shortages");

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from your React app's domain
const corsOptions = {
  origin: "https://chemyslimiteddemo-admin.onrender.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());

// Ensure that you have the correct MongoDB connection string.
// Replace "your-connection-string" with your actual connection string.
mongoose.connect(
  "mongodb+srv://kaosvioge:formentera1@chemys-admin-database.fz7jxky.mongodb.net/?retryWrites=true&w=majority",
  {
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/auth/products", productRoutes);
app.use("/api/auth/shortages", shortageRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Global unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle the error here or log it
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
