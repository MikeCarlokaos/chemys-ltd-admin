// crud-admin/server/src/routes/shortages.js

const express = require("express");
const Shortage = require("../models/Shortage");

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
        { alternatives: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const totalItems = await Shortage.countDocuments(findQuery);

    const sortOptions = {};
    sortOptions[criteria] = sortOrder;

    const shortages = await Shortage.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { alternatives: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .collation({ locale: "en", strength: 2 }) // Enable case-insensitive, accent-sensitive sorting
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      shortages,
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching shortages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/name-data", async (req, res) => {
  try {
    const nameData = await Shortage.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(nameData);
  } catch (error) {
    console.error("Error fetching name data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/total-items", async (req, res) => {
  try {
    const totalItems = await Shortage.countDocuments({ _id: { $ne: null } });
    console.log("Total items:", totalItems); // Log the total items
    res.json({ totalItems });
  } catch (error) {
    console.error("Error fetching total items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, alternatives, form, packSize } = req.body;

  try {
    const newShortage = await Shortage.create({
      name,
      alternatives,
      form,
      packSize,
    });
    res.status(201).json(newShortage);
  } catch (error) {
    console.error("Error creating shortage:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, alternatives, form, packSize } = req.body;

  try {
    const updatedShortage = await Shortage.findByIdAndUpdate(
      id,
      { name, alternatives, form, packSize },
      { new: true }
    );
    res.json(updatedShortage);
  } catch (error) {
    console.error("Error updating shortage:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Shortage.findByIdAndDelete(id);
    res.json({ success: true, message: "Shortage deleted successfully" });
  } catch (error) {
    console.error("Error deleting shortage:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
