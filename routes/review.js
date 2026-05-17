const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const {isLoggedIn, isAuthor}=require("../middleware.js");


// review validation
const reviewValidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
    

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async(req,res) =>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review has deleted");
    res.redirect(`/listing/${id}`);
}));

//review
router.post("/",isLoggedIn,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();

    req.flash("success","Review has created");
    res.redirect(`/listing/${listing._id}`);

}));

module.exports = router;