const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); //to access data from .env file

const secretKey = process.env.SECRET_KEY; // Secret key for JWT, should be stored in .env file

const vendorRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if vendor exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save vendor
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();

    // Success response
    res.status(201).json({
      message: "Vendor registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
}

const vendorLogin =async(req,res)=>{
  const {email,password}=req.body;
  try{
    const vendor = await Vendor .findOne({email}) //getting email of already regestered vendor from the vendor model where the details of vendor are stored 
    if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(400).json({message:"Invalid email or password"});
    }
      const token =jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"});

    res.status(200).json({success:"Login successful" , token})
    console.log("this is token",token);
  }catch(error){
    res.status(500).json({
      message:"Login failed",
      error: error.message
    })
  }
}

const getAllVendors = async (req, res) => {  //"Show all vendors and their firms"
  try{
    const vendors=await Vendor.find().populate('firm');
    res.status(200).json({vendors});
  }catch(error){
    console.error("Error fetching vendors:", error);
    res.status(500).json({ 
      message: "Failed to fetch vendors",
      error: error.message 
    });
  }
}

const getVendorById = async (req, res) => {
  // Extracts the vendor ID from the URL parameter
  // Example: For route '/vendors/:id' and URL '/vendors/123',
  // req.params.id = "123"
  const vendorId = req.params.id;

  try {
    // 1. Find the vendor by ID
    // 2. .populate('firm') replaces the firm ObjectIDs in the vendor document
    //    with the actual firm documents from the firms collection
    const vendor = await Vendor.findById(vendorId).populate('firm');

    // If no vendor found with that ID
    if (!vendor) {
      return res.status(404).json({ 
        message: "Vendor not found" 
      });
    }

    // Successful response with:
    // - Status code 200 (OK)
    // - Vendor data including FULL firm details (not just IDs)
    res.status(200).json({
      message: "Vendor retrieved successfully",
      vendor: vendor // Contains vendor info + populated firm data
    });

  } catch (error) {
    // Handles unexpected errors:
    // - Invalid ID format (CastError)
    // - Database connection issues
    // - Other server errors
    console.error("Error fetching vendor:", error);
    
    res.status(500).json({ 
      message: "Failed to fetch vendor",
      error: error.message // Returns the specific error details
    });
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };