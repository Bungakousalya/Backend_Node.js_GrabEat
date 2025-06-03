const mongoose=require("mongoose");

 const firmSchema=new mongoose.Schema({
    firmName:{
        type:String,
        required:true,
        unique:true
    },
    area:{
        type:String,
        required:true
    },
    category:{
        type:[
            {
                type:String,
                enum:['veg','non-veg']
            }
        ]
    },
    region:{
        type:[
            {
                type:String,
                enum:['south-indian','north-indian','chinese','italian','mexican','continental']
            }
        ]
    },
    offer:{
        type:String,
    },
    image:{
        type:String
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId, // Stores Vendor IDs
        ref:"Vendor", //Tells Mongoose this ObjectId refers to documents in the Vendor collection.
        required: true
    },
    products:[ //Array of products associated with this firm
        {
            type:mongoose.Schema.Types.ObjectId, // Stores Product IDs
            ref:"Product" //Tells Mongoose this ObjectId refers to documents in the Product collection.
        }
    ]

 });
    module.exports=mongoose.model("Firm",firmSchema); //Exporting the Firm model to use it in other files.