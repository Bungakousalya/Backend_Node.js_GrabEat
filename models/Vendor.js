const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firm:[{
    type: mongoose.Schema.Types.ObjectId, // Stores Firm IDs
    ref: "Firm" // Tells Mongoose this ObjectId refers to documents in the Firm collection.
  }]
});

module.exports = mongoose.model("Vendor", vendorSchema);