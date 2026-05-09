const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError=require("./utility/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

const url='mongodb://127.0.0.1:27017/roomify';

//database connection
async function main() {
  await mongoose.connect(url);
  console.log("mongo are working");
};

main().catch(err => console.log(err));



app.listen(8080,()=>{
    console.log("all fine 1");
});

app.get("/",(req,res)=>{
    console.log("all fine");
});

//schema validation
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

// review validation
const reviewValidation=(req,res,next)=>{
    let {error}=reviewValidation.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
    
    

//index route
app.get("/listing",wrapAsync(async (req,res) => {
   const allListings= await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
}));

//create new route
app.get("/listing/new",(req,res)=>{
    res.render("./listings/newListing.ejs");
});

//show route
app.get("/listing/:id",wrapAsync(async (req,res) =>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    console.log("yet clear");
    res.render("./listings/show.ejs",{listing});
}));

//add new data
app.post("/listing/new/add",validateListing,wrapAsync(async (req,res) => {
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
   }));

//edit route
app.get("/listing/:id/edit",wrapAsync(async (req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/updatePage.ejs",{listing});
}));
//update route
app.put("/listing/:id/update",validateListing,wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"please send valid data");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//DELETE ROUTE
app.delete("/listing/:id/delete",wrapAsync(async (req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

//review
app.post("/listing/:id/reviews",reviewValidation,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();

    console.log("new review has saved");
    res.redirect(`/listing/${listing._id}`);

}));

// error handling

app.use((req,res,next) => {
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next) => {
    let {status=400, message="something went wrong"}=err;
    res.render("error.ejs",{message});
    // res.status(status).send(message);
});