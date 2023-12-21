// crud-admin/server/src/routes/products.js

const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const criteria = req.query.criteria || "name";
    const order = req.query.order || "asc";
    const searchTerm = req.query.search || "";

    console.log("Sorting criteria:", criteria);
    console.log("Sorting order:", order);
    console.log("Search term:", searchTerm);

    const sortOrder = order === "desc" ? -1 : 1;

    const findQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { ingredients: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const totalItems = await Product.countDocuments(findQuery);

    const sortOptions = {};
    sortOptions[criteria] = sortOrder;

    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { ingredients: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .collation({ locale: "en", strength: 2 }) // Enable case-insensitive, accent-sensitive sorting
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      products,
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/ingredients-data", async (req, res) => {
  try {
    const ingredientsData = await Product.aggregate([
      {
        $group: {
          _id: "$ingredients",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          ingredients: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(ingredientsData);
  } catch (error) {
    console.error("Error fetching ingredients data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/total-items", async (req, res) => {
  try {
    const totalItems = await Product.countDocuments({ _id: { $ne: null } });
    console.log("Total items:", totalItems); // Log the total items
    res.json({ totalItems });
  } catch (error) {
    console.error("Error fetching total items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, ingredients, packSize } = req.body;

  try {
    const newProduct = await Product.create({ name, ingredients, packSize });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, packSize } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, ingredients, packSize },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
