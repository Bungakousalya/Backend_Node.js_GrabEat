const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    firm:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Firm",
        required: true
    }
});

const Product=mongoose.model("Product",productSchema);
module.exports=Product;