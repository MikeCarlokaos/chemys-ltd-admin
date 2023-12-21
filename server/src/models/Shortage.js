// crud-admin/server/src/models/Shortage.js

const mongoose = require("mongoose");

const shortageSchema = new mongoose.Schema({
  name: String,
  alternatives: String,
  form: String,
  packSize: String,
});

const Shortage = mongoose.model("Shortage", shortageSchema);

module.exports = Shortage;
