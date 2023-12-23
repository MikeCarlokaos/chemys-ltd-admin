// crud-admin/server/src/app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const shortageRoutes = require("./routes/shortages");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/crud_admin", {});
mongoose.connect(
  "mongodb+srv://kaosvioge:formentera1@chemys-admin-database.fz7jxky.mongodb.net/",
  {}
);

app.use("/api/auth", authRoutes);
app.use("/api/auth/products", productRoutes); // Include the product routes
app.use("/api/auth/shortages", shortageRoutes); // Include the product routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
