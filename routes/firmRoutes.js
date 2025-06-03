const express=require("express");
const firmController=require("../controllers/firmController");
const verifyToken=require("../middleware/verifyToken"); 
const router=express.Router();

router.post("/add-firm", verifyToken, firmController.addFirm); // Add firm with token verification
router.delete("/delete-firm/:FirmId", verifyToken, firmController.deleteFirmById); // Delete firm by ID with token verification

module.exports=router;