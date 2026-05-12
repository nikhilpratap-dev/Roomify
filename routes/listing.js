const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {listingSchema}=require("../schema.js");



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

//index route
router.get("/",wrapAsync(async (req,res) => {
   const allListings= await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
}));

//create new route
router.get("/new",(req,res)=>{
    res.render("./listings/newListing.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res) =>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}));

//add new data
router.post("/new/add",validateListing,wrapAsync(async (req,res) => {
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
   }));

//edit route
router.get("/:id/edit",wrapAsync(async (req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/updatePage.ejs",{listing});
}));
//update route
router.put("/:id/update",validateListing,wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"please send valid data");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//DELETE ROUTE
router.delete("/:id/delete",wrapAsync(async (req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

module.exports = router;