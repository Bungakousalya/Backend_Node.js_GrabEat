const express = require("express");
const router = express.Router();
const { vendorRegister,vendorLogin,getAllVendors ,getVendorById} = require("../controllers/vendorController");

router.post("/register", vendorRegister);
router.post("/login", vendorLogin);
router.get("/all-vendors",getAllVendors);
router.get("/:id", getVendorById);

module.exports = router;