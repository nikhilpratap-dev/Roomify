const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

let listingSchema=new Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://www.freepik.com/free-photo/empty-sea-beach-background_3502704.htm#fromView=keyword&page=1&position=0&uuid=304bdd9a-40a3-4eff-9ec3-e3199df846c9&query=Beach1",
        set : (v) => v===""
        ?"https://www.freepik.com/free-photo/empty-sea-beach-background_3502704.htm#fromView=keyword&page=1&position=0&uuid=304bdd9a-40a3-4eff-9ec3-e3199df846c9&query=Beach"
        :v,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ]
});

listingSchema.post("findOneAndDelete",async(listing) => {
   if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
   }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;