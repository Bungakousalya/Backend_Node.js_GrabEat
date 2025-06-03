const Firm=require("../models/Firm");
const Vendor= require("../models/Vendor");
const Product = require("../models/Product");
const multer= require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage }).single('image'); // 'image' is the field name in the form

const addFirm=async(req,res)=>{
    try{
        upload(req, res, async function(err) { // Wrapped in upload handler
            if (err) return res.status(400).json({message: "Image upload failed"});
            
            const {firmName, area, category, region, offer} = req.body;
            const image=req.file?req.file.filename:null;
            const vendorId = req.vendorId;
            
            const vendor=await Vendor.findById(vendorId);
            if(!vendor){
                return res.status(404).json({message:"Vendor not found"});
            }
            
            const firm=new Firm({
                firmName, 
                area, 
                category: category ? (Array.isArray(category) ? category : [category]) : [],
                region: region ? (Array.isArray(region) ? region : [region]) : [],
                offer, 
                image,
                vendor: vendor._id
            });
            
            const savedFirm = await firm.save();
            
            // Add firm to vendor's firm list using findByIdAndUpdate
            const updatedVendor = await Vendor.findByIdAndUpdate(
                vendorId,
                { $push: { firm: savedFirm._id } },
                { new: true }
            );
            
            return res.status(201).json({message:"Firm added successfully", firm: savedFirm});
        });
    }catch(error){
        console.error("Error adding firm:", error);
        return res.status(500).json({message:"Failed to add firm", error:error.message});
    }
}

const deleteFirmById=async (req, res)=>{
    try{
        const FirmId=req.params.FirmId;
        const vendorId = req.vendorId; // Get vendor ID from token
        
        // Find the firm first to get its details
        const firm=await Firm.findById(FirmId);
        if(!firm){
            return res.status(404).json({message:"Firm not found"});
        }
        
        // Check if this firm belongs to the authenticated vendor
        if(firm.vendor.toString() !== vendorId.toString()){
            return res.status(403).json({message:"Not authorized to delete this firm"});
        }
        
        // Delete all products associated with this firm
        await Product.deleteMany({firm: FirmId});
        
        // Remove firm from vendor's firm list
        await Vendor.findByIdAndUpdate(
            vendorId,
            { $pull: { firm: FirmId } }
        );
        
        // Delete the firm
        await Firm.findByIdAndDelete(FirmId);
        
        return res.status(200).json({
            message: "Firm and associated products deleted successfully",
            deletedFirm: {
                id: firm._id,
                name: firm.firmName
            }
        });
        
    }catch(err){
        console.error("Error deleting firm:", err);
        return res.status(500).json({ message: "Failed to delete firm", error: err.message });   
    }
};

module.exports={
    addFirm,
    deleteFirmById
}