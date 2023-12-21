// crud-admin/server/src/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  packSize: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
