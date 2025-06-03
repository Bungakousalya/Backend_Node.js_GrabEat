const Product= require('../models/Product');
const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');

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

const addProduct = async (req, res) => {
    try {
        upload(req, res, async function(err) { // Wrapped in upload handler
            if (err) return res.status(400).json({ message: "Image upload failed" });

            const { productName, price, category, description } = req.body;
            const image = req.file ? req.file.filename : null;
            const firmId = req.params.firmId;

            const firm = await Firm.findById(firmId);
            if (!firm) {
                return res.status(404).json({ message: "Firm not found" });
            }

            const product = new Product({
                productName,
                price,
                category,
                description,
                image,
                firm: firm._id
            });

            const savedProduct = await product.save();

            // Add product to firm's product list using findByIdAndUpdate
            const updatedFirm = await Firm.findByIdAndUpdate(
                firmId,
                { $push: { products: savedProduct._id } },
                { new: true }
            );

            return res.status(201).json({ 
                message: "Product added successfully", 
                product: savedProduct
            });
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: "Failed to add product", error: error.message });
    }
};

const getProductsByFirm = async (req, res) => {
    try{
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({message:"Firm not found"});
        }
        const restaurantName=firm.firmName;
        const products=await Product.find({firm:firmId});
        res.status(200).json({restaurantName,products});
    }catch(err){
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Failed to fetch products", error: err.message });
    }
};

const deleteProductById=async (req, res)=>{
    try{
        const productId=req.params.productId;
        
        // Find the product first to get its details
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        
        // Remove product from firm's products list
        await Firm.findByIdAndUpdate(
            product.firm,
            { $pull: { products: productId } }
        );
        
        // Delete the product
        await Product.findByIdAndDelete(productId);
        
        return res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct: {
                id: product._id,
                name: product.productName
            }
        });
        
    }catch(err){
        console.error("Error deleting product:", err);
        return res.status(500).json({ message: "Failed to delete product", error: err.message });   
    }
};

module.exports = {
    addProduct,
    getProductsByFirm,
    deleteProductById
};