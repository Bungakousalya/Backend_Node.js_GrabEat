require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes"); 

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

// Test route
app.get("/home", (req, res) => {
  res.send("GrabEat Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});