const Vendor = require('../models/Vendor');
const jwt=require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const secretKey = process.env.SECRET_KEY; // Secret key for JWT, should be stored in .env file

const verifyToken=async(req,res,next)=>{
    const token=req.headers.token; // Extract token from request headers
    if(!token){
        return res.status(401).json({message:"Access denied, no token provided"});
    }
    try{
        const decoded=jwt.verify(token,secretKey);
        const vendor=await Vendor.findById(decoded.vendorId);
        if(!vendor){
            return res.status(404).json({message:"Vendor not found"});
        }
        req.vendorId = vendor._id
        next()
    }
    catch(error){
        console.error(error)
        return res.status(500).json({error:"invalid token"});
    }
}

module.exports=verifyToken;