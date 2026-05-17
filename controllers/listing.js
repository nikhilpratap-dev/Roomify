const Listing=require("../models/listing.js");
const { create } = require("../models/review.js");


// index Page
module.exports.index=async (req,res) => {
   const allListings= await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
}

// create New Data
module.exports.createNewListing=(req,res)=>{
    res.render("./listings/newListing.ejs");
}

//show Listing page
module.exports.showListing=async (req,res) =>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
    populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listing");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
}


//add new Listing
module.exports.addNewListing=async (req,res) => {
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing has created !");
    res.redirect("/listing");
}

//edit Listing page
module.exports.editListingPage=async (req,res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/updatePage.ejs",{listing});
}


//update Listing 
module.exports.updatePage=async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"please send valid data");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated");
    res.redirect(`/listing/${id}`);
}

//delete Listing
module.exports.deleteListing=async (req,res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listing");
}